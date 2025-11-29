"use client";
import FiltersBar from "@/components/pages/FiltersBar";
import GuideCard from "@/components/pages/GuideCard";

const Guide = () => {
  const handleFilters = (filters: string) => {
    console.log("Selected filters:", filters);
    // filter cards here (client or server)
  };
  return (
    <div>
      <FiltersBar onFilterChange={handleFilters} />
      <div className=" items-center grid grid-cols-2 md:grid md:grid-cols-3 lg:grid lg:grid-cols-5">
        <GuideCard />
        <GuideCard />
        <GuideCard />
        <GuideCard />
        <GuideCard />
        <GuideCard />
        <GuideCard />
        <GuideCard />
      </div>
    </div>
  );
};

export default Guide;
