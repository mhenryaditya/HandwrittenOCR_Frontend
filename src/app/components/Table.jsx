import "primereact/resources/themes/lara-light-cyan/theme.css";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useEffect, useState } from "react";
import api from "@/service/apiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function Table({ columns, titleTable, baseUrlAPI, refreshTrigger }) {
  const [fullData, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedData, setSelectedData] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [filtersState, setFiltersState] = useState({});
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [globalFilterFields, setGlobalFilterFields] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalRecords: 0,
    rowsPerPage: 10,
  });

  const router = useRouter();

  // const formatDate = (value) => {
  //     return value.toLocaleDateString('en-US', {
  //         day: '2-digit',
  //         month: '2-digit',
  //         year: 'numeric'
  //     });
  // };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    const updatedFilters = {
      ...filters,
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    };
    setGlobalFilterValue(value);
    setFilters(updatedFilters);
    setFiltersState(updatedFilters);
    getData(1, pagination.rowsPerPage, updatedFilters);
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-between align-items-center">
        <h4 className="m-0 self-center">Data {titleTable}</h4>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </IconField>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    let dtAction = columns.find(
      (col) => col.header?.toLowerCase() === "action"
    );
    return (
      <>
        {dtAction.toDetail ? (
          <button
            type="button"
            onClick={() => router.push(`${dtAction.toDetail}/${rowData.id}`)}
            className="cursor-pointer text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        ) : null}
        {dtAction.toEdit ? (
          <button
            type="button"
            onClick={() => router.push(`${dtAction.toEdit}/${rowData.id}`)}
            className="cursor-pointer text-yellow-400 border border-yellow-400 hover:bg-yellow-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2"
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
        ) : null}
        {dtAction.toRemove ? (
          <button
            type="button"
            onClick={() => removeData(rowData)}
            className="cursor-pointer text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        ) : null}
      </>
    );
  };

  const removeData = (dataSelected) => {
    Swal.fire({
      title: "Delete Confirmation",
      icon: "warning",
      text: "Are you sure to delete this data?",
      showConfirmButton: true,
      confirmButtonColor: "#1A56DB",
      confirmButtonText: "Yes",
      showCancelButton: true,
      cancelButtonColor: "#C81E1E",
      cancelButtonText: "No",
    }).then(async (res) => {
      if (res.isConfirmed) {
        await api.delete(
          `${columns[columns.length - 1].toRemove}/${dataSelected.id}`
        );
        getData();
        toast.success("Data deleted successfully");
      }
    });
  };

  const header = renderHeader();

  useEffect(() => {
    if (!columns) return;

    const dataFilter = {};

    columns.forEach((col) => {
      if (!col.title || !col.type) return; // Skip invalid columns

      if (col.type === "string" || col.type === "image") {
        dataFilter[col.title] = {
          operator: "AND",
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        };
      } else if (col.type === "date") {
        dataFilter[col.title] = {
          operator: "AND",
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        };
      } else if (col.type === "number") {
        dataFilter[col.title] = {
          operator: "AND",
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        };
      }

      if (col.header.toLowerCase() !== "action") {
        setGlobalFilterFields((prev) => [...prev, col.title]);
      }
    });

    setFilters((prevFilters) => ({
      ...prevFilters,
      ...dataFilter,
    }));
  }, [columns]);

  const onColumnFilterChange = (newFilters) => {
    setFilters(newFilters);
    setFiltersState(newFilters);
    getData(1, pagination.rowsPerPage, newFilters);
  };

  const getData = async (
    page = pagination.currentPage,
    length = pagination.rowsPerPage,
    filtersArg = filtersState
  ) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page,
      length: length,
    });
    // Global filters
    if (filtersArg.global?.value) {
      params.append("search", filtersArg.global.value);
    }
    // Column filters
    Object.keys(filtersArg).forEach((key) => {
      if (key !== "global" && filtersArg[key]?.value != null) {
        params.append(key, filtersArg[key].value);
      }
    });
    // Sorting
    if (sortField && sortOrder) {
      params.append("sort_by", sortField);
      params.append("sort_order", sortOrder === 1 ? "asc" : "desc");
    }
    try {
      const { data } = await api.get(`${baseUrlAPI}?${params.toString()}`);
      setData(data.data);
      setPagination((prev) => ({
        ...prev,
        currentPage: data.pagination.current_page,
        totalRecords: data.pagination.total,
      }));
    } catch (err) {
      console.log("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(1, pagination.rowsPerPage);
  }, [refreshTrigger]);

  const onPageChange = (e) => {
    const newPage = e.page + 1;
    const newRows = e.rows;
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
      rowsPerPage: newRows,
    }));
    getData(newPage, newRows);
  };

  const onSortChange = (e) => {
    setSortField(e.sortField);
    setSortOrder(e.sortOrder);
    getData(pagination.currentPage, pagination.rowsPerPage, filters);
  };

  return (
    <>
      {loading ? (
        <div className="mt-5 flex flex-col gap-2">
          <div role="status" className="animate-pulse">
            <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full max-w-[360px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full max-w-[330px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full max-w-[300px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full max-w-[360px]"></div>
            <span className="sr-only">Loading...</span>
          </div>
          <div role="status" className="animate-pulse">
            <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full max-w-[360px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full max-w-[330px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full max-w-[300px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full max-w-[360px]"></div>
            <span className="sr-only">Loading...</span>
          </div>
          <div role="status" className="animate-pulse">
            <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full max-w-[360px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full max-w-[330px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full max-w-[300px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full max-w-[360px]"></div>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card">
          <DataTable
            value={fullData}
            paginator
            header={header}
            rows={pagination.rowsPerPage}
            first={(pagination.currentPage - 1) * pagination.rowsPerPage}
            totalRecords={pagination.totalRecords}
            lazy
            onPage={onPageChange}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[5, 10, 25, 50]}
            dataKey="id"
            onFilter={onColumnFilterChange}
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={globalFilterFields}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={onSortChange}
            emptyMessage={"No " + titleTable.toLowerCase() + " found."}
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          >
            {Array.isArray(columns) &&
              columns.map((element) => {
                if (element.header.toLowerCase() === "action") {
                  return (
                    <Column key="action" body={actionBodyTemplate} exportable={false} />
                  );
                }

                if (element.type === "image") {
                  return (
                    <Column
                      key={element.title}
                      field={element.title}
                      header={element.header}
                      body={(rowData) => {
                        let path = rowData
                        element.title.split('.').forEach(val => {
                          path = path[val]
                        })
                        return (
                          <img
                            src={path}
                            alt={element.header}
                            className="w-52 object-contain rounded shadow-md"
                          />
                        )
                      }}
                    />
                  );
                }

                return (
                  <Column
                    key={element.title}
                    field={element.title}
                    header={element.header}
                    sortable={element.sortable}
                    filter={element.filter}
                    filterPlaceholder={element.filterPlaceholder}
                  />
                );
              })}
          </DataTable>
        </div>
      )}
    </>
  );
}
