import Link from "next/link";

export default function AdminBlogBreadcrumbs({ currentPage }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm font-medium text-[#a27942]">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/admin" className="transition-colors hover:text-[#c2410c]">
            Admin
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link
            href="/admin/blog"
            className="transition-colors hover:text-[#c2410c]"
          >
            Blog
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-[#746f68]">
          {currentPage}
        </li>
      </ol>
    </nav>
  );
}
