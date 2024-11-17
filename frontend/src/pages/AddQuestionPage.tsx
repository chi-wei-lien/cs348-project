import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import addQuestion from "../actions/question/addQuestion";
import Cookies from "js-cookie";
import { PrimaryButton, SecondaryButton } from "../components/Buttons";

const AddQuestionPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    link: "",
  });
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    const sessionId = Cookies.get("sessionId");
    if (!sessionId) {
      navigate("/login");
    }
  }, []);

  const autoFill = (url: string) => {
    const pathSegments = url.split("/").filter(Boolean);
    let lastSegment = pathSegments[pathSegments.length - 1];
    let targetSegmentIndex = pathSegments.length - 1;

    if (lastSegment[0] === "?") {
      targetSegmentIndex -= 1;
    }

    if (pathSegments[targetSegmentIndex] === "description") {
      targetSegmentIndex -= 1;
    }

    return pathSegments[targetSegmentIndex] || "";
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let newData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    if (!changed) {
      setChanged(true);
      if (e.target.name == "link") {
        newData = {
          ...newData,
          name: autoFill(e.target.value),
        };
      }
    } else {
      newData = {
        ...newData,
      };
    }
    setFormData(newData);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const add = async () => {
      addQuestion(() => {
        navigate("/login");
      }, formData);
      navigate("/");
    };
    add();
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Question Link
          </label>
          <input
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Question Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            placeholder="Two Sum"
          />
        </div>
        <div className="flex gap-2">
          <PrimaryButton type="submit">Add a question</PrimaryButton>
          <SecondaryButton type="button" onClick={handleCancel}>
            Cancel
          </SecondaryButton>
        </div>
      </form>
    </div>
  );
};

export default AddQuestionPage;
