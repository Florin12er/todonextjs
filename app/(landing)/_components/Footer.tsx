export function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-gray-300 py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Your Todo App. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
