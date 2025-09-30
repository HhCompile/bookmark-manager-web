export default function Footer() {
  return (
    <footer className="bg-white mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} 书签管理器. All rights reserved.
        </p>
      </div>
    </footer>
  );
}