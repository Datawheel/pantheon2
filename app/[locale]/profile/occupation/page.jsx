import {redirect} from "next/navigation";

export default async function Page() {
  const occupationCandidates = [
    "soccer-player",
    "sculptor",
    "politician",
    "actor",
    "writer",
    "singer",
    "athlete",
    "musician",
    "religious-figure",
    "film-director",
    "military-personnel",
    "painter",
    "basketball-player",
    "composer",
    "cyclist",
    "tennis-player",
    "philosopher",
    "racing-driver",
    "nobleman",
    "biologist",
    "mathematician",
    "physicist",
    "wrestler",
    "companion",
    "businessperson",
    "skier",
    "social-activist",
    "astronomer",
    "astronaut",
    "chemist",
    "physician",
    "architect",
    "explorer",
    "swimmer",
    "chess-player",
    "hockey-player",
    "inventor",
    "historian",
    "coach",
    "boxer",
    "engineer",
    "skater",
    "economist",
    "handball-player",
    "model",
    "extremist",
    "computer-scientist",
    "poker-player",
    "pornographic-actor",
    "psychologist",
    "gymnast",
    "celebrity",
    "fencer",
    "comic-artist",
    "linguist",
    "journalist",
    "volleyball-player",
    "martial-arts",
    "presenter",
    "referee",
    "photographer",
    "archaeologist",
    "conductor",
    "comedian",
    "producer",
    "designer",
    "badminton-player",
    "table-tennis-player",
    "artist",
    "dancer",
    "baseball-player",
    "anthropologist",
    "lawyer",
    "cricketer",
    "geographer",
    "golfer",
    "geologist",
    "game-designer",
    "snooker",
    "american-football-player",
    "sociologist",
    "mafioso",
    "diplomat",
    "pilot",
    "mountaineer",
    "youtuber",
    "judge",
    "fashion-designer",
    "occultist",
    "political-scientist",
    "pirate",
    "public-worker",
    "rugby-player",
    "magician",
    "statistician",
    "chef",
    "inspiration",
    "critic",
    "gamer",
    "go-player",
    "bullfighter",
  ];
  const redirectSlug =
    occupationCandidates[
      Math.floor(Math.random() * occupationCandidates.length)
    ];
  redirect(`/profile/occupation/${redirectSlug}`);
}
