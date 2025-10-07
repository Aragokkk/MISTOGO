import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BackHomeButton from "../../components/BackHomeButton";
import BackButton from "../../components/BackButton";

function Blog() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{t("blog_page.title")}</h1>
      <p>{t("blog_page.description")}</p>

      <Link to="/blog/test-post">
        <button>{t("blog_page.read_button")}</button>
      </Link>

      <BackHomeButton />
      <BackButton />
    </div>
  );
}

export default Blog;
