import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface Page404Props {
  className?: string;
}

export default function Page404({ className }: Page404Props){
  return (
    <div
      className={cn(
        "py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6",
        className
      )}
    >
      <div className="mx-auto max-w-screen-sm text-center">
        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
          404
        </h1>
        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
          Something is missing...
        </p>
        <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
          Sorry, we can't find this page. You'll find plenty of things to
          explore on the homepage.
        </p>
        <Link
          to="/"
          className="inline-flex bg-primary-600 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
};