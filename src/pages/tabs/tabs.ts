import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { VideosPage } from '../videos/videos';
import { LibraryPage } from '../library/library';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = HomePage;
  tab2Root = VideosPage;
  tab3Root = LibraryPage;

  constructor() {}
}
