import { useNavigate } from "react-router-dom";
import "./style.css";
import { MY_USER_UPDATE_ABSOLUTE_PATH } from "../../constants";

interface Props {
  nickname: string;
}

export default function UpdateButton({ nickname }: Props) {
  const navigator = useNavigate();

  const onUpdateClickHandler = () => {
    navigator(MY_USER_UPDATE_ABSOLUTE_PATH(nickname));
  };

  return (
    <div className="update-button" onClick={onUpdateClickHandler}>
      편집
    </div>
  );
}
