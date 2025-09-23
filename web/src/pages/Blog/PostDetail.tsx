import { useParams } from "react-router-dom";
import BackHomeButton from "../../components/BackHomeButton";
import BackButton from "../../components/BackButton";

function Post() {
  const { slug } = useParams();
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Стаття: {slug}</h1>
      <p>Детальний текст статті.</p>
      <BackHomeButton />
      <BackButton />
    </div>
  );
}

export default Post;
