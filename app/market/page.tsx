"use client";
import FiltersBar from "@/components/pages/FiltersBar";
import GuideCard from "@/components/pages/GuideCard";

const Market = () => {
  const handleFilters = (filters: string) => {
    //       // Empty string or nullish -> show all cards
    console.log("No filters selected, showing all cards");
    //   // reset your cards state to all cards
    //   setCards(allCards);
    //   return;
    // }
    console.log("Selected filters:", filters);

    // const filteredCards = allCards.filter(card => card.category === filters);
    // setCards(filteredCards);
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

export default Market;
