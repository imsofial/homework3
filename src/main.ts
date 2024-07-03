import { ComicData } from './types.js';
import { formatDistanceToNow } from 'date-fns';

const getSomeThingBtn = document.getElementById("getsmthBtn") as HTMLButtonElement;
const imgElement = document.getElementById("image") as HTMLImageElement;
const typeForm = document.getElementById("type-form") as HTMLFormElement;
const title = document.getElementById("title") as HTMLParagraphElement;
const date = document.getElementById("date") as HTMLParagraphElement;
const comicContainer = document.getElementById("comicContainer") as HTMLDivElement;
const errElement = document.getElementById("err") as HTMLParagraphElement;

function displayComic(comicData: ComicData): void {
  const title = document.getElementById("title");
  const imgElement = document.getElementById("image") as HTMLImageElement;
  const date = document.getElementById("date");

  if (title && imgElement && date) {
    title.textContent = comicData.safe_title;
    imgElement.src = comicData.img;
    imgElement.alt = comicData.alt;

    const comicDate = new Date(`${comicData.year}-${comicData.month}-${comicData.day}`);
    date.textContent = formatDistanceToNow(comicDate, { addSuffix: true });
  }
}



async function fetchIdentifier(email: string): Promise<string> {
  const params = new URLSearchParams({ email });
  const response = await fetch(
    `https://fwd.innopolis.university/api/hw2?${params}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch identifier");
  }
  return response.json();
}

async function fetchComic(comic_id: string): Promise<ComicData> {
  const response = await fetch(
    `https://fwd.innopolis.university/api/comic?id=${comic_id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch comic");
  }
  return response.json();
}

let comicVisible = false;

getSomeThingBtn.addEventListener("click", async function (e: Event) {
  e.preventDefault();
  if (comicVisible) {
    title.textContent = "";
    imgElement.src = "";
    imgElement.alt = "";
    date.textContent = "";
    errElement.textContent = "";
    comicContainer.style.display = "none";
    comicVisible = false;
  } else {
    title.textContent = "Loading...";
    const email = (typeForm.elements.namedItem("email") as HTMLInputElement).value;
    try {
      const id = await fetchIdentifier(email);
      const comicData = await fetchComic(id);
      title.textContent = comicData.safe_title;
      imgElement.src = comicData.img;
      imgElement.alt = comicData.alt;
      const dateString = `${comicData.year}-${comicData.month}-${comicData.day}`;
      date.textContent = new Date(dateString).toLocaleDateString();
      comicContainer.style.display = "flex";
      comicVisible = true;
    } catch (error) {
      errElement.textContent = "Error";
      console.error(error);
    }
  }
});
