import { useNavigate } from "react-router-dom";

const Navigator = Component => props => {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
};

export default Navigator;