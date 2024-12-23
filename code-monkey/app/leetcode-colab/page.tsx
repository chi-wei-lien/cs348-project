"use client";

import { useEffect, useState } from "react";
import getQuestions from "@/lib/api/question/getQuestions";
import QuestionType from "@/types/QuestionType";
import Done from "./Done";
import { PrimaryButton } from "@/components/buttons";
import { redirect } from "next/navigation";
import { getCurrUserInfo } from "@/lib/auth";
import UserType from "@/types/UserType";
import getUsers from "@/lib/api/users/getUsers";
import getQuestionStatistics from "@/lib/api/question/getQuestionStatistics";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";

const PAGE_SIZE = 10;

const LeetCodeColabPage = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [qNameQuery, setQNameQuery] = useState("");
  const [queryNotCompleted, setQueryNotCompleted] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number>();
  const [completed, setCompleted] = useState(0);
  const [userDropdownText, setUserDropdownText] = useState("Posted By");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | undefined>();
  const [userId, setUserId] = useState<number | undefined>();
  const [hasLoaded, setHasLoaded] = useState(false);
  // const [qsCount, setQsCount] = useState(0);

  // Pagination
  const [lastPostedTime, setLastPostedTime] = useState<Date>(new Date());
  const [firstPostedTime, setFirstPostedTime] = useState<Date>();
  const [lastQuestionId, setLastQuestionId] = useState<number>();
  const [firstQuestionId, setFirstQuestionId] = useState<number>();
  const [pageNumber, setPageNumber] = useState(0);

  const resetPagination = () => {
    setLastPostedTime(new Date());
    setFirstPostedTime(undefined);
    setLastQuestionId(undefined);
    setFirstQuestionId(undefined);
    setPageNumber(0);
  };

  const getQuestionsWrapper = async (
    qNameQuery: string,
    isLoggedIn: boolean,
    queryNotCompleted: boolean,
    pageSize: number,
    takeLower: boolean,
    firstQuestionId?: number,
    lastQuestionId?: number,
    firstPostedTime?: Date,
    lastPostedTime?: Date,
    userId?: number,
    selectedUser?: number
  ) => {
    const questionData = await getQuestions(
      qNameQuery,
      isLoggedIn,
      queryNotCompleted,
      pageSize,
      takeLower,
      firstQuestionId,
      lastQuestionId,
      firstPostedTime,
      lastPostedTime,
      userId,
      selectedUser
    );
    if (questionData.data) {
      setQuestions(questionData.data);
    }

    if (questionData.first_posted_time) {
      console.log(
        "set first_posted_time",
        new Date(questionData.first_posted_time)
      );
      setFirstPostedTime(new Date(questionData.first_posted_time));
    }

    if (questionData.last_posted_time) {
      console.log(
        "set last_posted_time",
        new Date(questionData.last_posted_time)
      );
      setLastPostedTime(new Date(questionData.last_posted_time));
    }

    if (questionData.first_q_id) {
      console.log("set first_q_id", questionData.first_q_id);
      setFirstQuestionId(questionData.first_q_id);
    }

    if (questionData.last_q_id) {
      console.log("set last_q_id", questionData.last_q_id);
      setLastQuestionId(questionData.last_q_id);
    }
    return questionData.data;
  };

  const fetchLeftPageQuestions = async () => {
    if (pageNumber === 0) {
      return;
    }
    setPageNumber(pageNumber - 1);
    await getQuestionsWrapper(
      qNameQuery,
      isLoggedIn,
      queryNotCompleted,
      PAGE_SIZE,
      true,
      firstQuestionId,
      undefined,
      firstPostedTime,
      undefined,
      userId,
      selectedUser
    );
  };

  const fetchRightPageQuestions = async () => {
    console.log("curr firstPostedTime", firstPostedTime);
    console.log("curr lastPostedTime", lastPostedTime);
    console.log("curr firstQuestionId", firstQuestionId);
    console.log("curr lastQuestionId", lastQuestionId);

    setPageNumber(pageNumber + 1);
    await getQuestionsWrapper(
      qNameQuery,
      isLoggedIn,
      queryNotCompleted,
      PAGE_SIZE,
      false,
      undefined,
      lastQuestionId,
      undefined,
      lastPostedTime,
      userId,
      selectedUser
    );
  };

  useEffect(() => {
    const { username, userId } = getCurrUserInfo() || {};
    if (username) {
      setIsLoggedIn(true);
      setUsername(username);
      setUserId(userId);
    }
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    const onLoad = async () => {
      const userData = await getUsers(isLoggedIn, () => {});

      if (userData) {
        setUsers(userData);
      }

      await getQuestionsWrapper(
        qNameQuery,
        isLoggedIn,
        queryNotCompleted,
        PAGE_SIZE,
        false,
        firstQuestionId,
        lastQuestionId,
        firstPostedTime,
        lastPostedTime,
        userId,
        selectedUser
      );

      if (isLoggedIn) {
        const stat = await getQuestionStatistics();
        if (stat) {
          setCompleted(stat.completed_count);
          // setQsCount(stat.question_count);
        }
      }
    };

    if (hasLoaded) onLoad();
  }, [qNameQuery, selectedUser, queryNotCompleted, hasLoaded]);

  const handleAddQuestion = () => {
    redirect("/leetcode-colab/add-question");
  };

  // const completeness = useMemo(() => {
  //   if (qsCount === 0) return 0;
  //   return parseFloat(((completed / qsCount) * 100).toFixed(2));
  // }, [completed, qsCount]);

  return (
    <div className="md:h-[95%] bg-cardPrimary rounded-md shadow p-10 md:w-full">
      <div className="w-full flex items-center justify-between flex-wrap">
        <div className="relative mt-5 mb-3">
          <button
            type="button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            {userDropdownText}
            <svg
              className="w-5 h-5 -mr-1 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path
                fillRule="evenodd"
                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {showUserDropdown && (
            <div
              className="absolute left-0 z-10 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="py-1" role="none">
                <a
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-100 hover:cursor-pointer"
                  role="menuitem"
                  onClick={() => {
                    setSelectedUser(undefined);
                    setShowUserDropdown(!showUserDropdown);
                    setUserDropdownText("Posted By");
                    resetPagination();
                  }}
                >
                  -
                </a>
                {users.map((user) => {
                  return (
                    <a
                      key={user.id}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-100 hover:cursor-pointer"
                      role="menuitem"
                      onClick={() => {
                        setSelectedUser(user.id);
                        setShowUserDropdown(!showUserDropdown);
                        setUserDropdownText(user.username);
                        resetPagination();
                      }}
                    >
                      {user.username}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {isLoggedIn && (
          <div className="relative mt-5 mb-3">
            <button
              onClick={() => {
                setQueryNotCompleted(!queryNotCompleted);
                resetPagination();
              }}
              className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <div className="flex items-center h-5">
                <input
                  id="hs-table-search-checkbox-1"
                  type="checkbox"
                  className="text-blue-600 border-gray-200 rounded focus:ring-blue-500"
                  checked={queryNotCompleted}
                  onChange={() => {}}
                />
                <label className="sr-only">Checkbox</label>
              </div>
              Not Completed
            </button>
          </div>
        )}
        {isLoggedIn && (
          <PrimaryButton type="button" onClick={handleAddQuestion}>
            Add Question
          </PrimaryButton>
        )}
      </div>
      <div className="w-full flex justify-between py-3">
        <button
          onClick={() => {
            fetchLeftPageQuestions();
          }}
        >
          <GoTriangleLeft color="black" size={30} />
        </button>
        <div className="relative w-80 border rounded-lg">
          <label className="sr-only">Search</label>
          <input
            type="text"
            name="hs-table-search"
            id="hs-table-search"
            className="text-black block w-full px-3 py-2 text-sm rounded-lg shadow-sm ps-9 focus:z-10 focus:border-black focus:ring-black disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Search for items"
            value={qNameQuery}
            onChange={(e) => {
              setQNameQuery(e.target.value);
              resetPagination();
            }}
          />
          <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
            <svg
              className="text-gray-400 size-4"
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
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
        </div>
        <button
          onClick={() => {
            fetchRightPageQuestions();
          }}
        >
          <GoTriangleRight color="black" size={30} />
        </button>
      </div>
      <div className="w-full rounded-lg max-h-[500px] overflow-y-scroll">
        <table className="border divide-y divide-gray-200">
          <thead className="bg-fontLogo">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium text-white uppercase text-start"
              >
                No.
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium text-white uppercase text-start"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium text-white uppercase text-start text-nowrap"
              >
                Posted By
              </th>
              {isLoggedIn && (
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium text-white uppercase text-start"
                >
                  Completed
                </th>
              )}
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium text-white uppercase text-start"
              >
                Solution
              </th>
              {isLoggedIn && (
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium text-white uppercase text-end"
                >
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {questions.map((question, index) => {
              return (
                <Done
                  question={question}
                  myUsername={username}
                  key={question.q_id}
                  completed={completed}
                  setCompleted={setCompleted}
                  isLoggedIn={isLoggedIn}
                  number={questions.length - index}
                />
                // <div className="h-[100px] bg-slate-500" key={question.q_id}>
                //   hello
                // </div>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="bg-cardPrimary rounded-md shadow p-10 md:w-full">
      <div className="w-full flex items-center justify-between flex-wrap">
        <div className="relative mt-5 mb-3">
          <button
            type="button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            {userDropdownText}
            <svg
              className="w-5 h-5 -mr-1 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path
                fillRule="evenodd"
                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {showUserDropdown && (
            <div
              className="absolute left-0 z-10 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="py-1" role="none">
                <a
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-100 hover:cursor-pointer"
                  role="menuitem"
                  onClick={() => {
                    setSelectedUser(undefined);
                    setShowUserDropdown(!showUserDropdown);
                    setUserDropdownText("Posted By");
                    resetPagination();
                  }}
                >
                  -
                </a>
                {users.map((user) => {
                  return (
                    <a
                      key={user.id}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-100 hover:cursor-pointer"
                      role="menuitem"
                      onClick={() => {
                        setSelectedUser(user.id);
                        setShowUserDropdown(!showUserDropdown);
                        setUserDropdownText(user.username);
                        resetPagination();
                      }}
                    >
                      {user.username}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {isLoggedIn && (
          <div className="relative mt-5 mb-3">
            <button
              onClick={() => {
                setQueryNotCompleted(!queryNotCompleted);
                resetPagination();
              }}
              className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <div className="flex items-center h-5">
                <input
                  id="hs-table-search-checkbox-1"
                  type="checkbox"
                  className="text-blue-600 border-gray-200 rounded focus:ring-blue-500"
                  checked={queryNotCompleted}
                  onChange={() => {}}
                />
                <label className="sr-only">Checkbox</label>
              </div>
              Not Completed
            </button>
          </div>
        )}
        {isLoggedIn && (
          <PrimaryButton type="button" onClick={handleAddQuestion}>
            Add Question
          </PrimaryButton>
        )}
      </div>
      {/* {isLoggedIn && (
        <div className="mb-4">
          <div className="w-full flex justify-between mb-1">
            <span className="text-base font-medium text-red-400">
              Completed ({completed}/{qsCount})
            </span>
            <span className="text-sm font-medium text-red-400">
              {completeness}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 transition ease-in-out">
            <div
              className="bg-red-400 h-2.5 rounded-full"
              style={{ width: `${completeness}%` }}
            ></div>
          </div>
        </div>
      )} */}
      <div className="w-full flex justify-between py-3">
        <button
          onClick={() => {
            fetchLeftPageQuestions();
          }}
        >
          <GoTriangleLeft color="black" size={30} />
        </button>
        <div className="relative w-80 border rounded-lg">
          <label className="sr-only">Search</label>
          <input
            type="text"
            name="hs-table-search"
            id="hs-table-search"
            className="text-black block w-full px-3 py-2 text-sm rounded-lg shadow-sm ps-9 focus:z-10 focus:border-black focus:ring-black disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Search for items"
            value={qNameQuery}
            onChange={(e) => {
              setQNameQuery(e.target.value);
              resetPagination();
            }}
          />
          <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
            <svg
              className="text-gray-400 size-4"
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
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
        </div>
        <button
          onClick={() => {
            fetchRightPageQuestions();
          }}
        >
          <GoTriangleRight color="black" size={30} />
        </button>
      </div>
      <div className="w-96 rounded-lg h-96 overflow-y-scroll">
        <table className="border divide-y divide-gray-200">
          <thead className="bg-fontLogo">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium text-white uppercase text-start"
              >
                No.
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium text-white uppercase text-start"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium text-white uppercase text-start text-nowrap"
              >
                Posted By
              </th>
              {isLoggedIn && (
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium text-white uppercase text-start"
                >
                  Completed
                </th>
              )}
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium text-white uppercase text-start"
              >
                Solution
              </th>
              {isLoggedIn && (
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium text-white uppercase text-end"
                >
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {questions.map((question, index) => {
              return (
                <Done
                  question={question}
                  myUsername={username}
                  key={question.q_id}
                  completed={completed}
                  setCompleted={setCompleted}
                  isLoggedIn={isLoggedIn}
                  number={questions.length - index}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeetCodeColabPage;
