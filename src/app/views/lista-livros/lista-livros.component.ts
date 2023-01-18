import { LivroVolumeInfo } from './../../models/livroVolumeInfo';
import { Item, LivrosResultado } from './../../models/interfaces';
import { LivroService } from './../../service/livro.service';
import { Component } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap, tap, throwError } from 'rxjs';
import { FormControl } from '@angular/forms';


const PAUSA = 300
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl()
  mensagemErro = ''
  semResultados = ''
  livrosResultado: number

  constructor(private service: LivroService) { }


  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(PAUSA),
      filter((valorDigitado) => valorDigitado.length >= 3),
      distinctUntilChanged(),
      tap(() => console.log('Fluxo inicial')),
      switchMap(valorDigitado =>
        this.service.buscar(valorDigitado)
      ),
      map(resultado => {
        this.livrosResultado = resultado.totalItems
        if (!resultado.items) {
          this.semResultados = 'Não foi encontrado nenhum livro com os termos buscados.'
        }
        return resultado.items ?? []

      }),
      map(items => this.resultadoLivros(items)),
      catchError(error => {
        console.log(error)
        return throwError(() => new Error(this.mensagemErro = 'Ops! Houve um problema... Recarregue a página.'))
      })
    )

  resultadoLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    })
  }

}





