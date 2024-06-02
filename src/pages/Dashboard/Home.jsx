import React from "react";
import { BASE_URL, CARDS, USERS } from "../../config";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useSWR from "swr";

const Home = () => {
  const navigate = useNavigate();

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

  const cards = async () => {
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

  const { data: Users } = useSWR("usersAll", users);
  const { data: Cards } = useSWR("cardsAll", cards);

  return (
    <div className="w-full lg:ps-64">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* <!-- Card --> */}
          <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div className="p-4 md:p-5">
              <div className="flex items-center gap-x-2">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                  Total users
                </p>
              </div>

              <div className="mt-1 flex items-center gap-x-2">
                {!Users ? (
                  <div className="animate-pulse w-10 h-10 bg-neutral-500 rounded-lg self-center"></div>
                ) : (
                  <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    {Users?.length}
                  </h3>
                )}
              </div>
            </div>
          </div>
          {/* <!-- End Card --> */}

          {/* <!-- Card --> */}
          <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div className="p-4 md:p-5">
              <div className="flex items-center gap-x-2">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                  Total Cards
                </p>
              </div>

              <div className="mt-1 flex items-center gap-x-2">
                {!Cards ? (
                  <div className="animate-pulse w-10 h-10 bg-neutral-500 rounded-lg self-center"></div>
                ) : (
                  <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    {Cards.length}
                  </h3>
                )}
              </div>
            </div>
          </div>
          {/* <!-- End Card --> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
