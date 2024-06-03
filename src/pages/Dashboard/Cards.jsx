import React, { useState } from "react";
import Input from "../../components/ui/Input";
import { Plus, X, FolderOutput, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, CARDS, USERS } from "../../config";
import useSWR, { mutate } from "swr";
import axios from "axios";
import Table from "../../components/ui/Table";
import { useFormik } from "formik";
import { HSOverlay } from "preline";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const columnData = ({ startIndex }) => [
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
    accessorKey: "UUID_UA",
    header: "USER",
    cell: (props) => (
      <span className="text-sm text-gray-500 dark:text-neutral-400">
        {props.getValue()}
      </span>
    ),
  },
  {
    accessorKey: "Seri_CD",
    header: "SERI",
    cell: (props) => (
      <span className="text-sm text-gray-500 dark:text-neutral-400">
        {props.getValue()}
      </span>
    ),
  },
  {
    accessorKey: "Weight_CD",
    header: "WEIGHT",
    cell: (props) => (
      <span className="text-sm text-gray-500 dark:text-neutral-400">
        {props.getValue()}
      </span>
    ),
  },
  {
    accessorKey: "Fineness_CD",
    header: "FINENESS",
    cell: (props) => (
      <span className="text-sm text-gray-500 dark:text-neutral-400">
        {props.getValue()}
      </span>
    ),
  },
  {
    accessorKey: "Form_CD",
    header: "FORM",
    cell: (props) => (
      <span className="text-sm text-gray-500 dark:text-neutral-400">
        {props.getValue()}
      </span>
    ),
  },
];

const Cards = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetcher = async () => {
    const auth = JSON.parse(sessionStorage.getItem("auth"));
    if (!auth) {
      navigate("/auth/login");
      return;
    }

    const response = await axios.get(`${BASE_URL}/${CARDS}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
      withCredentials: true,
    });
    return response.data;
  };

  const users = async () => {
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

  const { data: card } = useSWR("cards", fetcher);
  const { data: user } = useSWR("users", users);

  const onSubmit = async (values) => {
    try {
      const auth = JSON.parse(sessionStorage.getItem("auth"));
      if (!auth) {
        navigate("/auth/login");
        return;
      }

      const send = {
        ...values,
        user: selectedOption,
        weight: parseFloat(values.weight),
        fineness: parseInt(values.fineness),
      };

      const response = await axios.post(`${BASE_URL}/${CARDS}`, send, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        withCredentials: true,
      });

      setValues({
        user: "",
        seri: "",
        weight: "",
        form: "",
        fineness: "",
      });

      mutate("cards");
      HSOverlay.close(document.getElementById("hs-modal-cards"));
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
    isSubmitting,
    setValues,
  } = useFormik({
    initialValues: {
      user: "",
      seri: "",
      weight: "",
      form: "",
      fineness: "",
    },
    onSubmit,
  });

  const filteredUsers = user?.filter((user) =>
    user.Name_UA.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionClick = (value) => {
    setSelectedOption(value);
    setOpen(false);
  };

  const handleDeleteAll = async () => {
    try {
      const auth = JSON.parse(sessionStorage.getItem("auth"));
      if (!auth) {
        navigate("/auth/login");
        return;
      }

      const response = await axios.delete(`${BASE_URL}/${CARDS}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        withCredentials: true,
      });

      mutate("cards");

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
    if (!card) return;

    const excelData = card.map((item, index) => ({
      NO: index + 1,
      USER: item.UUID_UA,
      SERI: item.Seri_CD,
      WEIGHT: item.Weight_CD,
      FINENESS: item.Fineness_CD,
      FORM: item.Form_CD,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cards");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, "Cards.xlsx");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil((card?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = card?.slice(startIndex, startIndex + itemsPerPage);

  const columns = columnData({ startIndex });

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
                      Cards
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Add card, edit and more.
                    </p>
                  </div>

                  <div>
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gradient-to-r from-btnGold to-btnGold text-neutral-800 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        data-hs-overlay="#hs-modal-cards"
                      >
                        <Plus size="16px" />
                        Add Card
                      </button>
                      {!card ? (
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
                      {!card ? (
                        <div className="animate-pulse w-28 h-10 bg-neutral-500 rounded-lg self-center"></div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleDeleteAll}
                          className={`${
                            card.length === 0 ? "hidden" : "block"
                          } py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gradient-to-r from-btnGold to-btnGold text-neutral-800 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none`}
                        >
                          <Trash2 size="16px" />
                          Delete All Card
                        </button>
                      )}

                      <div
                        id="hs-modal-cards"
                        className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none [--overlay-backdrop:static]"
                        data-hs-overlay-keyboard="false"
                      >
                        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
                          <div className="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                              <h3 className="font-bold text-gray-800 dark:text-gold">
                                Add Card
                              </h3>
                              <button
                                type="button"
                                className="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
                                data-hs-overlay="#hs-modal-cards"
                              >
                                <span className="sr-only">Close</span>
                                <X size="18px" color="#FFD874" />
                              </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                              <div className="p-4 overflow-y-auto">
                                {!user ? (
                                  <div className="animate-pulse w-full h-10 bg-neutral-500 rounded-lg self-center"></div>
                                ) : (
                                  <div onClick={() => setOpen(!open)}>
                                    <label
                                      htmlFor="user"
                                      className="block text-sm font-medium mb-3 dark:text-gold"
                                    >
                                      UUID
                                    </label>
                                    <button
                                      type="button"
                                      className="relative py-3 px-4 pe-9 flex text-nowrap w-full cursor-pointer bg-white border dark:border-neutral-700 dark:text-neutral-500 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 rounded-lg text-start text-sm dark:bg-neutral-900 disabled:opacity-50 disabled:pointer-events-none focus:border-gold focus:ring-gold"
                                    >
                                      <span className="text-neutral-400">
                                        {selectedOption
                                          ? user.find(
                                              (item) =>
                                                item.UUID_UA === selectedOption
                                            )?.Name_UA
                                          : "Select UUID By Name"}
                                      </span>
                                      <svg
                                        className="absolute top-1/2 end-3 -translate-y-1/2 flex-shrink-0 size-3.5 text-gray-500"
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
                                        <path d="m7 15 5 5 5-5" />
                                        <path d="m7 9 5-5 5 5" />
                                      </svg>
                                    </button>
                                    {open && (
                                      <div className="mt-2 max-h-72 pb-1 px-1 space-y-0.5 z-20 w-full bg-neutral-900 rounded-lg overflow-hidden overflow-y-auto border border-neutral-700">
                                        <div className="bg-neutral-900 p-2 -mx-1 sticky top-0">
                                          <input
                                            type="text"
                                            placeholder="search"
                                            className="block w-full bg-neutral-900 text-sm border-neutral-700 rounded-lg focus:border-gold focus:ring-gold py-2 px-3 text-neutral-400"
                                            autoFocus
                                            value={searchTerm}
                                            onChange={(e) =>
                                              setSearchTerm(e.target.value)
                                            }
                                          />
                                        </div>
                                        {filteredUsers.map((user) => (
                                          <div
                                            key={user.UUID_UA}
                                            onClick={() =>
                                              handleOptionClick(user.UUID_UA)
                                            }
                                            className="py-2 px-4 w-full text-sm text-neutral-200 cursor-pointer hover:bg-neutral-700 rounded-lg"
                                          >
                                            <span>{user.Name_UA}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}

                                <Input
                                  htmlFor="seri"
                                  title="Seri"
                                  type="text"
                                  id="seri"
                                  name="seri"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.seri}
                                  placeholder="Input your seri"
                                />
                                <Input
                                  htmlFor="weight"
                                  title="Weight"
                                  type="text"
                                  id="weight"
                                  name="weight"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.weight}
                                  placeholder="Input your weight"
                                />
                                <Input
                                  htmlFor="form"
                                  title="Form"
                                  type="text"
                                  id="form"
                                  name="form"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.form}
                                  placeholder="Input your form"
                                />
                                <Input
                                  htmlFor="fineness"
                                  title="Fineness"
                                  type="text"
                                  id="fineness"
                                  name="fineness"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.fineness}
                                  placeholder="Input your fineness"
                                />
                              </div>
                              <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                                <button
                                  type="submit"
                                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-btnGold text-neutral-800 hover:bg-neutral-900 hover:border-gold hover:text-white disabled:opacity-50 disabled:pointer-events-none"
                                  disabled={isSubmitting}
                                >
                                  Save changes
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

                {!card ? (
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
                            {card?.length}
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
                                  ? "dark:bg-btnGold dark:text-neutral-900 dark:border-btnGold dark:hover:bg-btnGold"
                                  : ""
                              } py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-gold dark:text-gold dark:hover:bg-neutral-800`}
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

export default Cards;
