import { log } from "logger";
import { CounterButton, Link } from "ui";
import MainLayout from '../layouts/MainLayout';

export const metadata = {
  title: "Store | Kitchen Sink",
};

export default function Store(): JSX.Element {
  log("Hey! This is the Store page.");

  return (
	<MainLayout>
    <div className="">
      <h1 className="text-3xl font-bold p-6">
        myyyy <br />
        <span>Kitchen Sink</span>
      </h1>
      {/* <CounterButton /> */}
    </div>
	</MainLayout>
  );
}
