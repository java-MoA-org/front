import { useNavigate } from "react-router-dom";
import "./style.css";
import { MY_USER_UPDATE_ABSOLUTE_PATH } from "../../constants";

export default function UpdateButton() {
  const navigator = useNavigate();

  const onUpdateClickHandler = () => {
    navigator(`${MY_USER_UPDATE_ABSOLUTE_PATH}`);
  };

  return (
    <div className="update-button" onClick={onUpdateClickHandler}>
      편집
    </div>
  );
}
