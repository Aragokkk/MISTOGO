import { Link } from "react-router-dom";
import BackHomeButton from "../../components/BackHomeButton";
import BackButton from "../../components/BackButton";

function Blog() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Блог</h1>
      <p>Список публікацій</p>

      <Link to="/blog/test-post"><button>Читати статтю</button></Link>

      <BackHomeButton />
      <BackButton />
    </div>
  );
}

export default Blog;
