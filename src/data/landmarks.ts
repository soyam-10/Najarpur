import { geoToPlane } from "@/lib/geoUtils";

type LandmarkSeed = {
  name: string;
  nepaliName: string;
  description: string;
  position: [number, number, number];
  lat: number;
  lng: number;
  coverImage: string;
};

function makeLandmark(
  name: string,
  nepaliName: string,
  description: string,
  lat: number,
  lng: number,
  coverImage: string
): LandmarkSeed {
  return { name, nepaliName, description, position: geoToPlane(lat, lng), lat, lng, coverImage };
}

export const landmarks: LandmarkSeed[] = [
  makeLandmark(
    "Temple",
    "मन्दिर",
    "The heart of Najarpur's spiritual life. Villagers gather here during festivals, daily prayers, and important ceremonies that have been celebrated for generations.",
    27.062104406313182, 85.35290788787194,
    "/images/landmarks/temple.jpg"
  ),
  makeLandmark(
    "Shree Krishna Pranami Community Primary School",
    "श्री कृष्ण प्रणामी प्राथमिक सामुदायिक विद्यालय",
    "The foundation of Najarpur's future. Shree Krishna Pranami Community Primary School has been educating the children of the village, nurturing the next generation of leaders and thinkers.",
    27.061329320629447, 85.35411228295851,
    "/images/landmarks/school.jpg"
  ),
  makeLandmark(
    "Sports Ground",
    "खेल मैदान",
    "A place of energy and community spirit. The sports ground hosts cricket, football and volleyball matches that bring the whole village together.",
    27.066008396005735, 85.35141753447047,
    "/images/landmarks/sports-ground.jpg"
  ),
  makeLandmark(
    "Shree Nawa Kiran Youba Club",
    "श्री नवकिरण युवा क्लब",
    "Established in 2053 B.S., Shree Nawa Kiran Youba Club is the driving force of Najarpur's youth. The club organizes events, community service, sports tournaments and cultural programs. It also houses the Shree Nijananda Community Library and sports equipment including football, volleyball, cricket gear, nets and more.",
    27.063400010857713, 85.35302228427439,
    "/images/landmarks/youth-club.jpg"
  ),
  makeLandmark(
    "Samuhik Biu Bridhi Co. Pvt. Ltd.",
    "सामूहिक बीउ बृद्धि सहकारी संस्था",
    "The economic backbone of Najarpur. This cooperative buys crops directly from local farmers and sells them outside the village, ensuring fair prices and supporting livelihoods. They also run seed collection and seed development programs.",
    27.06294673528145, 85.35349368084401,
    "/images/landmarks/sahakari.jpg"
  ),
  makeLandmark(
    "Chautari",
    "चौतारी",
    "The soul of village life. Under the shade of old trees, villagers gather at the Chautari to share stories, discuss community matters, and simply enjoy each other's company.",
    27.063057296993946, 85.35336645592075,
    "/images/landmarks/chautari.jpg"
  ),
  makeLandmark(
    "Village Dairy",
    "डेयरी",
    "The village dairy collects fresh milk from cows and buffaloes from local farmers, supporting the livelihoods of animal-rearing households in Najarpur.",
    27.063070729018595, 85.35440662712813,
    "/images/landmarks/dairy.jpg"
  ),
  makeLandmark(
    "Village Entry Gate",
    "गाउँको प्रवेशद्वार",
    "The welcoming gateway into Najarpur. The entry gate marks the beginning of the village and greets all who arrive.",
    27.066886147614145, 85.35221701162608,
    "/images/landmarks/entry-gate.jpg"
  ),
];

export const VILLAGE_CENTER = geoToPlane(27.06369, 85.35333);