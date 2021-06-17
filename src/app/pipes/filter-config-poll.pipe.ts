import { Pipe, PipeTransform } from "@angular/core";
import { Configuration } from "../interfaces/poll/configuration/configuration";

@Pipe({
  name: "filterConfigPoll",
})
export class FilterConfigPollPipe implements PipeTransform {
  transform(configPolls: Configuration[], texto: string): Configuration[] {
    if (texto.length === 0) return configPolls;

    texto = texto.toLowerCase();

    return configPolls.filter((configPoll) => {
      return (
        configPoll.institution.name.toLowerCase().includes(texto) ||
        configPoll.poll.name.toLowerCase().includes(texto) ||
        configPoll.reward.name.toLowerCase().includes(texto)
      );
    });
  }
}
