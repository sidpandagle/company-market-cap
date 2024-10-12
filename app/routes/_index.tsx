import type { MetaFunction } from "@remix-run/node";
import Table from "~/components/tables/main";

export const meta: MetaFunction = () => {
  return [
    { title: "Market Cap" },
    { name: "description", content: "Welcome to Market Cap!" },
  ];
};

export default function Index() {
  return (
    <div>
      <div className="m-6 ">
        <Table />
      </div>
    </div>
  );
}

