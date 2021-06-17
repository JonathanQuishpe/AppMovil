import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class UserData {
  favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(public storage: Storage) {}

  /*  hasFavorite(favorite: string): boolean {
    return (this.favorites.indexOf(favorite) > -1);
  }

  addFavorite(favorite: string): void {
    this.favorites.push(favorite);
  }

  removeFavorite(favorite: string): void {
    const index = this.favorites.indexOf(favorite);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
  } */

  async login(user: any, jwt: string): Promise<any> {
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUser(user);
      this.setToken(jwt);
      return window.dispatchEvent(new CustomEvent('user:login'));
    });
  }

  async signup(user: any, jwt: string): Promise<any> {
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUser(user);
      this.setToken(jwt);
      return window.dispatchEvent(new CustomEvent('user:signup'));
    });
  }

  async logout(): Promise<any> {
    return this.storage
      .remove(this.HAS_LOGGED_IN)
      .then(() => {
        this.storage.remove('user');
        this.storage.remove('token');
        this.storage.remove('questions');
        this.storage.remove('favoritesPoll');
        this.storage.remove('favoritesReward');
        return true;
      })
      .then(() => {
        window.dispatchEvent(new CustomEvent('user:logout'));
      });
  }

  async setUser(user: any): Promise<any> {
    return this.storage.set('user', user);
  }
  async setQuestions(questions: any): Promise<any> {
    return this.storage.set('questions', questions);
  }

  async setFilters(filters: any): Promise<any> {
    return this.storage.set('filters', filters);
  }

  async setSearch(search: any): Promise<any> {
    return this.storage.set('search', search);
  }

  async setOrders(order: any): Promise<any> {
    return this.storage.set('order', order);
  }

  async setFavoriteConfigurationPoll(favoritesPolls: any): Promise<any> {
    return this.storage.set('favoritesPoll', favoritesPolls);
  }

  async setFavoriteConfigurationReward(favoritesPolls: any): Promise<any> {
    return this.storage.set('favoritesReward', favoritesPolls);
  }

  async setToken(jwt: string): Promise<any> {
    return this.storage.set('token', jwt);
  }

  async getFavoriteConfigurationPoll(): Promise<any> {
    return this.storage.get('favoritesPoll').then((value) => {
      return value;
    });
  }

  async getFavoriteConfigurationReward(): Promise<any> {
    return this.storage.get('favoritesReward').then((value) => {
      return value;
    });
  }

  async getQuestions(): Promise<any> {
    return this.storage.get('questions').then((value) => {
      return value;
    });
  }

  async getFilters(): Promise<any> {
    return this.storage.get('filters').then((value) => {
      return value;
    });
  }

  async getSearch(): Promise<any> {
    return this.storage.get('search').then((value) => {
      return value;
    });
  }

  async getOrders(): Promise<any> {
    return this.storage.get('order').then((value) => {
      return value;
    });
  }

  async getUser(): Promise<any> {
    return this.storage.get('user').then((value) => {
      return value;
    });
  }

  async getRol(): Promise<number> {
    return this.storage.get('user').then((value) => {
      return value.role.id;
    });
  }

  async getToken(): Promise<string> {
    return this.storage.get('token').then((value) => {
      return value;
    });
  }

  async isLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  }

  async setTheme(theme: string): Promise<any> {
    return this.storage.set('theme', theme);
  }

  async getTheme(): Promise<string> {
    return this.storage.get('theme').then((value) => {
      return value;
    });
  }

  async setShowSlides(showed: string): Promise<any> {
    return this.storage.set('showed', showed);
  }

  async getShowSlides(): Promise<string> {
    return this.storage.get('showed').then((value) => {
      return value;
    });
  }


  async checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  }
}
