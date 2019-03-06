import axios from "axios";
import { key } from "../config";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const result = await axios(
        `https://www.food2fork.com/api/search?key=${key}&q=${this.query}`
      );
      console.log(result);

      this.result = result.data.recipes;
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
}
