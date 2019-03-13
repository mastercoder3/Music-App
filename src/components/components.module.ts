import { NgModule } from '@angular/core';
import { FeaturedComponent } from './featured/featured';
import { MostPlayedComponent } from './most-played/most-played';
import { RecommendedComponent } from './recommended/recommended';
import { RecentlyPlayedComponent } from './recently-played/recently-played';
import { PopularVideosComponent } from './popular-videos/popular-videos';
import { FavoriteArtistsComponent } from './favorite-artists/favorite-artists';
import { BestPlaylistsComponent } from './best-playlists/best-playlists';
import { PopularAlbumsComponent } from './popular-albums/popular-albums';
import { ChartsComponent } from './charts/charts';
import { VideosSliderComponent } from './videos-slider/videos-slider';
import { VideosPopularNowComponent } from './videos-popular-now/videos-popular-now';
import { NewVideosComponent } from './new-videos/new-videos';
import { LibraryFavoritesComponent } from './library-favorites/library-favorites';
import { MiniVideoPlayerComponent } from './mini-video-player/mini-video-player';
import { PlayerFooterComponent } from './player-footer/player-footer';

@NgModule({
  declarations: [
    FeaturedComponent,
    MostPlayedComponent,
    RecommendedComponent,
    RecentlyPlayedComponent,
    PopularVideosComponent,
    FavoriteArtistsComponent,
    BestPlaylistsComponent,
    PopularAlbumsComponent,
    ChartsComponent,
    VideosSliderComponent,
    VideosPopularNowComponent,
    NewVideosComponent,
    LibraryFavoritesComponent,
    MiniVideoPlayerComponent,
    PlayerFooterComponent
  ],
  imports: [],
  exports: [
    FeaturedComponent,
    MostPlayedComponent,
    RecommendedComponent,
    RecentlyPlayedComponent,
    PopularVideosComponent,
    FavoriteArtistsComponent,
    BestPlaylistsComponent,
    PopularAlbumsComponent,
    ChartsComponent,
    VideosSliderComponent,
    VideosPopularNowComponent,
    NewVideosComponent,
    LibraryFavoritesComponent,
    MiniVideoPlayerComponent,
    PlayerFooterComponent
  ]
})
export class ComponentsModule {}
