import React from "react";
import Image from "next/image";

export interface IItemCard {
  id: number;
  text: string;
  photo: string;
}

export interface ICardList {
  item: IItemCard;
}

const CardList = ({ item }: ICardList) => {
  return (
    <div className="flex mx-4 md:mx-8 flex-col gap-5">
      <div className="flex justify-start gap-3">
        <span className="text-sky-600 text-xl font-bold">{item.id}.</span>
        <p className="text-gray-800">{item.text}</p>
      </div>
      <Image
        src={item.photo}
        alt="Halaman login"
        width={200}
        height={800}
        className="border mx-auto"
      />
    </div>
  );
};

export default CardList;
