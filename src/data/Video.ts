import { Randomizer } from './Helpers/Randomizer';

export class Video {
  constructor(
    name: string,
    artistName: string,
    pictureUrl: string,
    youtubeVideoCode: string
  ) {
    this.name = name;
    this.artistName = artistName;
    this.pictureUrl = pictureUrl;

    this.videoUrl =
      'https://www.youtube.com/embed/' +
      youtubeVideoCode +
      '?controls=0&amp;modestbranding=1&amp;rel=0&amp;showinfo=0&amp;loop=0&amp;fs=0&amp;hl=en&amp;enablejsapi=1&amp;widgetid=1';

    this.viewsCount = Randomizer.randomIntFromInterval(
      100000,
      999999
    ).toLocaleString();

    this.likesCount = Randomizer.randomIntFromInterval(
      100000,
      999999
    ).toLocaleString();

    this.isLiked = Randomizer.randomIntFromInterval(0, 1) === 1;

    var minutes = Randomizer.randomIntFromInterval(2, 5);
    var seconds = Randomizer.randomIntFromInterval(1, 59);
    this.duration = minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
  }

  id: string;
  name: string;
  artistName: string;
  pictureUrl: string;
  viewsCount: string;
  likesCount: string;
  videoUrl: string;
  isLiked: boolean;
  duration: string;
}
