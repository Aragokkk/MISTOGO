const fs = require("fs");
const path = require("path");

const pages = {
  Home: ["Home"],
  Transport: ["Transport", "Mopeds", "Scooters", "Bikes"],
  Zones: ["Zones"],
  Blog: ["Blog", "PostDetail"],
  FAQ: ["FAQ"],
  Support: ["Support"],
  Auth: ["Auth", "Login", "Register", "ForgotPassword"],
  User: ["User", "Profile", "Trips", "Payments", "Settings"],
  Admin: ["Admin", "Vehicles", "Users", "Tarrifs", "Zones", "Posts"],
  System: ["NotFound", "Unauthorized"],
};

const baseDir = path.join(__dirname, "src/pages");

Object.entries(pages).forEach(([folder, files]) => {
  const dirPath = path.join(baseDir, folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  files.forEach((file) => {
    const filePath = path.join(dirPath, `${file}.tsx`);
    if (!fs.existsSync(filePath)) {
      const content = `function ${file}() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>${file}</h1>
      <p>Сторінка ${file}.</p>
    </div>
  );
}

export default ${file};
`;
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✅ Створено: ${filePath}`);
    }
  });
});

console.log("🚀 Всі сторінки згенеровані!");
