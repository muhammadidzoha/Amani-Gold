import axios from "axios";
import React, { useState } from "react";
import Table from "../../components/ui/Table";
import { BASE_URL, USERS } from "../../config";
import { useNavigate } from "react-router-dom";
import useSWR, { mutate } from "swr";
import { Plus, X, FolderOutput, Trash2 } from "lucide-react";
import Input from "../../components/ui/Input";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { HSOverlay } from "preline";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const columnData = ({ mutate, navigate, startIndex }) => [
  {
    accessorKey: "",
    header: "NO",
    cell: (props) => (
      <span className="text-sm text-gray-500 dark:text-neutral-400">
        {startIndex + props.row.index + 1}
      </span>
    ),
  },
  {
    accessorKey: "Name_UA",
    header: "NAME",
    cell: (props) => (
      <span className="text-sm text-gray-500 dark:text-neutral-400">
        {props.getValue()}
      </span>
    ),
  },
  {
    accessorKey: "Email_UA",
    header: "EMAIL",
    cell: (props) => (
      <span className="text-sm text-gray-500 dark:text-neutral-400">
        {props.getValue()}
      </span>
    ),
  },
  {
    accessorKey: "Phone_UA",
    header: "PHONE",
    cell: (props) => (
      <span className="text-sm text-gray-500 dark:text-neutral-400">
        {props.getValue()}
      </span>
    ),
  },
  {
    accessorKey: "Gold_UD",
    header: "GOLD",
    cell: (props) => (
      <span className="text-sm text-gray-500 dark:text-neutral-400">
        {props.getValue()}
      </span>
    ),
  },
  {
    accessorKey: "Balance_UD",
    header: "BALANCE",
    cell: (props) => (
      <span className="text-sm text-gray-500 dark:text-neutral-400">
        {props.getValue()}
      </span>
    ),
  },
  {
    accessorKey: "",
    header: "ACTION",
    cell: (props) => {
      const [open, setOpen] = useState(false);
      const [editID, setEditID] = useState(null);

      const handleOpen = (control) => {
        setOpen(control);
      };

      const onSubmit = async (values) => {
        try {
          const auth = JSON.parse(sessionStorage.getItem("auth"));
          if (!auth) {
            navigate("/auth/login");
            return;
          }

          const response = await axios.put(
            `${BASE_URL}/${USERS}/${editID}`,
            values,
            {
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
              withCredentials: true,
            }
          );

          setValues({
            Name_UA: "",
            Phone_UA: "",
          });

          mutate("users");
          handleOpen(false);
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
        } catch (error) {
          handleOpen(false);
          toast.error(error.response.data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
        }
      };

      const {
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        setValues,
        isSubmitting,
      } = useFormik({
        initialValues: {
          Name_UA: "",
          Phone_UA: "",
        },
        onSubmit,
      });

      const handleEdit = async (id) => {
        setValues({
          Name_UA: props.row.original.Name_UA,
          Phone_UA: props.row.original.Phone_UA,
        });

        handleOpen(true);
        setEditID(id);
      };

      const handleDelete = async (id) => {
        try {
          const auth = JSON.parse(sessionStorage.getItem("auth"));
          if (!auth) {
            navigate("/auth/login");
            return;
          }

          const response = await axios.delete(`${BASE_URL}/${USERS}/${id}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
            withCredentials: true,
          });

          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
          mutate("users");
        } catch (error) {
          toast.error(error.response.data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
        }
      };

      return (
        <div className="flex space-x-2">
          <div className="inline-flex">
            {open && (
              <div className="fixed top-0 start-0 size-full z-[80] bg-gray-900 bg-opacity-80">
                <div className="mt-7 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
                  <div className="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                    <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                      <h3 className="font-bold text-gray-800 dark:text-gold">
                        Edit User
                      </h3>
                      <button
                        type="button"
                        className="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
                        onClick={() => handleOpen(false)}
                      >
                        <span className="sr-only">Close</span>
                        <X size="18px" color="#FFD874" />
                      </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="p-4 overflow-y-auto">
                        <Input
                          htmlFor="Name_UA"
                          title="Name"
                          type="text"
                          id="Name_UA"
                          name="Name_UA"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.Name_UA}
                          placeholder="Input your name"
                        />
                        <Input
                          htmlFor="Phone_UA"
                          title="Phone"
                          type="text"
                          id="Phone_UA"
                          name="Phone_UA"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.Phone_UA}
                          placeholder="Input your phone"
                        />
                      </div>
                      <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                        <button
                          type="submit"
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-btnGold text-neutral-800 hover:bg-neutral-900 hover:border-gold hover:text-white disabled:opacity-50 disabled:pointer-events-none"
                          disabled={isSubmitting}
                        >
                          Edit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => handleEdit(props.row.original.UUID_UA)}
              className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:text-gold disabled:text-neutral-500"
            >
              Edit
            </button>
          </div>
          <button
            onClick={() => handleDelete(props.row.original.UUID_UA)}
            className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:text-gold disabled:text-neutral-500"
          >
            Delete
          </button>
        </div>
      );
    },
  },
];

const Users = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetcher = async () => {
    const auth = JSON.parse(sessionStorage.getItem("auth"));
    if (!auth) {
      navigate("/auth/login");
      return;
    }

    const response = await axios.get(`${BASE_URL}/${USERS}/all`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
      withCredentials: true,
    });
    return response.data;
  };

  const { data } = useSWR("users", fetcher);

  const preprocessData = (data) => {
    return data?.map((user) => {
      if (user.UserData && user.UserData.length > 0) {
        const { Gold_UD, Balance_UD } = user.UserData[0];
        return { ...user, Gold_UD, Balance_UD };
      }
      return user;
    });
  };

  const processedData = preprocessData(data);

  const totalPages = Math.ceil((processedData?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = processedData?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const columns = columnData({ mutate, navigate, startIndex });

  const handleDeleteAll = async () => {
    try {
      const auth = JSON.parse(sessionStorage.getItem("auth"));
      if (!auth) {
        navigate("/auth/login");
        return;
      }

      const response = await axios.delete(`${BASE_URL}/${USERS}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        withCredentials: true,
      });

      mutate("users");

      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const exportToExcel = async () => {
    if (!data) return;

    const excelData = data.map((item, index) => ({
      NO: index + 1,
      USER: item.UUID_UA,
      EMAIL: item.Email_UA,
      NAME: item.Name_UA,
      PHONE: item.Phone_UA,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, "Users.xlsx");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const onSubmit = async (values) => {
    try {
      const dataValue = {
        ...values,
        password: values.phone,
      };

      const response = await axios.post(`${BASE_URL}/${USERS}`, dataValue, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setValues({
        name: "",
        email: "",
        phone: "",
        password: "",
      });
      mutate("users");
      HSOverlay.close(document.getElementById("hs-modal-users"));
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    isSubmitting,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
    onSubmit,
  });

  return (
    <div className="w-full lg:ps-64">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                {/* <!-- Header --> */}
                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gold">
                      Users
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Add users, edit and more.
                    </p>
                  </div>

                  <div>
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gradient-to-r from-btnGold to-btnGold text-neutral-800 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        data-hs-overlay="#hs-modal-users"
                      >
                        <Plus size="16px" />
                        Add User
                      </button>
                      {!data ? (
                        <div className="animate-pulse w-28 h-10 bg-neutral-500 rounded-lg self-center"></div>
                      ) : (
                        <button
                          type="button"
                          onClick={exportToExcel}
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gradient-to-r from-btnGold to-btnGold text-neutral-800 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          <FolderOutput size="16px" />
                          Export To CSV
                        </button>
                      )}
                      {!data ? (
                        <div className="animate-pulse w-28 h-10 bg-neutral-500 rounded-lg self-center"></div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleDeleteAll}
                          className={`${
                            data.length === 0 ? "hidden" : "block"
                          } py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gradient-to-r from-btnGold to-btnGold text-neutral-800 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none`}
                        >
                          <Trash2 size="16px" />
                          Delete User And Card
                        </button>
                      )}
                      <div
                        id="hs-modal-users"
                        className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none [--overlay-backdrop:static]"
                        data-hs-overlay-keyboard="false"
                      >
                        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
                          <div className="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                              <h3 className="font-bold text-gray-800 dark:text-gold">
                                Add User
                              </h3>
                              <button
                                type="button"
                                className="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
                                data-hs-overlay="#hs-modal-users"
                              >
                                <span className="sr-only">Close</span>
                                <X size="18px" color="#FFD874" />
                              </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                              <div className="p-4 overflow-y-auto">
                                <Input
                                  htmlFor="name"
                                  title="Name"
                                  type="text"
                                  id="name"
                                  name="name"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.name}
                                  placeholder="Input your name"
                                />
                                <Input
                                  htmlFor="email"
                                  title="Email"
                                  type="email"
                                  id="email"
                                  name="email"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.email}
                                  placeholder="Input your email"
                                />
                                <Input
                                  htmlFor="phone"
                                  title="Phone"
                                  type="text"
                                  id="phone"
                                  name="phone"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.phone}
                                  placeholder="Input your phone"
                                />
                              </div>
                              <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                                <button
                                  type="submit"
                                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-btnGold text-neutral-800 hover:bg-neutral-900 hover:border-gold hover:text-white disabled:opacity-50 disabled:pointer-events-none"
                                  disabled={isSubmitting}
                                >
                                  Add
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- End Header --> */}

                {!data ? (
                  <div className="flex animate-pulse p-2">
                    <div className="ms-4 my-2 w-full">
                      <p
                        className="h-4 bg-neutral-500 rounded-full"
                        style={{ width: "40%" }}
                      ></p>

                      <ul className="mt-5 space-y-3">
                        <li className="w-full h-4 bg-neutral-500 rounded-full"></li>
                        <li className="w-full h-4 bg-neutral-500 rounded-full"></li>
                        <li className="w-full h-4 bg-neutral-500 rounded-full"></li>
                        <li className="w-full h-4 bg-neutral-500 rounded-full"></li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* <!-- Table --> */}
                    <Table
                      columnsData={columns}
                      tableData={currentData || []}
                    />
                    {/* <!-- End Table --> */}

                    {/* <!-- Footer --> */}
                    <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-neutral-400">
                          <span className="font-semibold text-gray-800 dark:text-gold">
                            {data?.length}
                          </span>{" "}
                          results
                        </p>
                      </div>

                      <div>
                        <nav className="inline-flex rounded-md shadow-sm isolate space-x-2">
                          <button
                            type="button"
                            className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-gold dark:text-gold dark:hover:bg-neutral-800"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                          >
                            <svg
                              className="flex-shrink-0 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m15 18-6-6 6-6" />
                            </svg>
                            Prev
                          </button>
                          {Array.from({ length: totalPages }, (_, index) => (
                            <button
                              key={index}
                              onClick={() => handlePageChange(index + 1)}
                              className={`${
                                currentPage === index + 1
                                  ? "dark:text-neutral-100 dark:bg-neutral-900 dark:border-neutral-900 dark:hover:bg-gold"
                                  : ""
                              } py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-800 shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-gold dark:text-gold dark:hover:bg-neutral-800`}
                            >
                              {index + 1}
                            </button>
                          ))}
                          <button
                            type="button"
                            className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-gold dark:text-gold dark:hover:bg-neutral-800"
                            onClick={() => handlePageChange(currentPage + 1)}
                          >
                            Next
                            <svg
                              className="flex-shrink-0 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                    {/* <!-- End Footer --> */}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
