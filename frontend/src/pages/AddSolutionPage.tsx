import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Editor from "react-simple-code-editor";
import Prism, { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-markdown.js";
import addSolution from "../actions/solution/addSolution";
import Language from "../types/Language";
import getLangs from "../actions/language/getLangs";
import Question from "../types/Question";
import getQuestion from "../actions/question/getQuestion";

const DEFAULT_LANG = "Language";

const AddSolutionPage = () => {
  const navigate = useNavigate();
  const { q_id } = useParams();
  const [langs, setLangs] = useState<Language[]>([]);
  const [question, setQuestion] = useState<Question | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [formData, setFormData] = useState({
    q_id: parseInt(q_id ?? "-1"),
    title: "",
    language: DEFAULT_LANG,
    tc: "",
    sc: "",
    notes: "",
    code: `function add(a, b) {\n  return a + b;\n}`,
  });

  useEffect(() => {
    const sessionId = Cookies.get("sessionId");
    if (!sessionId) {
      navigate("/login");
    }

    const load = async () => {
      setLangs((await getLangs()).data);
      if (q_id) {
        setQuestion(await getQuestion(parseInt(q_id)));
      }
    };

    load();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.language === DEFAULT_LANG) {
      setError("Please select the language of your code");
      return;
    }
    const add = async () => {
      await addSolution(() => {
        navigate(`/solutions/${q_id}`);
      }, formData);
      navigate(`/solutions/${q_id}`);
    };
    add();
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const [showDropDown, setShowDropDown] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setError(undefined);
    let newData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(newData);
  };

  const selectLang = (lang: string) => {
    setFormData({ ...formData, language: lang });
    setShowDropDown(false);
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <form
        style={{ width: "800px" }}
        className="p-5 mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Question
          </label>
          <input
            name="title"
            value={question?.name ?? ""}
            disabled={true}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Solution Title
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            placeholder="e.g. Fast Solution with O(n) time O(1) space!"
          />
        </div>
        <div className="relative inline-block mb-5 text-left">
          <div>
            <button
              type="button"
              onClick={() => setShowDropDown(!showDropDown)}
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {formData.language}
              <svg
                className="w-5 h-5 -mr-1 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          {showDropDown && (
            <div
              className="absolute left-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="py-1" role="none">
                {langs.map((lang) => (
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    onClick={() => selectLang(lang.name)}
                  >
                    {lang.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-5">
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Time Compexity
            </label>
            <input
              name="tc"
              value={formData.tc}
              onChange={handleChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              placeholder="e.g. O(n)"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Space Compexity
            </label>
            <input
              name="sc"
              value={formData.sc}
              onChange={handleChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              placeholder="e.g. O(1)"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Code
          </label>
          <div className="border-2 rounded-lg">
            <Editor
              value={formData.code}
              onValueChange={(code) => setFormData({ ...formData, code: code })}
              highlight={(code) =>
                highlight(code, Prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
              }}
            />
          </div>
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Notes in Markdown (Optional)
          </label>
          <div className="border-2 rounded-lg">
            <Editor
              value={formData.notes}
              onValueChange={(notes) =>
                setFormData({ ...formData, notes: notes })
              }
              highlight={(notes) => highlight(notes, Prism.languages.md, "md")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
              }}
            />
          </div>
        </div>
        <button
          type="submit"
          className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Add solution
        </button>
        <button
          type="button"
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          onClick={() => {
            handleCancel();
          }}
        >
          Cancel
        </button>
        {error && <div className="text-red-400">{error}</div>}
      </form>
    </div>
  );
};

export default AddSolutionPage;