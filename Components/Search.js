import React from 'react'
import { StyleSheet, View, Button, TextInput, FlatList, Text, ActivityIndicator} from 'react-native'
import FilmItem from "./FilmItem";
import { getFilmsFromApiWithSearchedText} from '../API/TMDBApi'

class Search extends React.Component {

    constructor(props) {
        super(props)
        this.searchedText = "" // Initialisation de notre donnée searchedText en dehors du state
        this.page = 0 // Compteur pour connaître la page courante
        this.totalPages = 0 // Nombre de pages totales pour savoir si on a atteint la fin des retours de l'API TMDB
        this.state = {
          films: [],
          isLoading: false // mis a faulse pa defaut
        }
      }


    _loadFilms() {
        if (this.searchedText.length > 0) { // Seulement si le texte recherché n'est pas vide
            this.setState({ isLoading: true })
            getFilmsFromApiWithSearchedText(this.searchedText).then(data => {
                this.page = data.page
                this.totalPages = data.total_pages
                this.setState({ 
                    films: [ ...this.state.films, ...data.results ],
                    isLoading: false // arret du chargement
            })
          })
        }
      }

    _searchTextInputChanged(text) {
        this.searchedText = text // Modification du texte recherché à chaque saisie de texte, sans passer par le setState comme avant
      }
    
    _searchFilms() {
        this.page = 0
        this.totalPages = 0
        this.setState({
          films: [],
        }, () => {
            this._loadFilms()
        })
      }

    _displayLoading() { //fonction de chargement lors de la recherche
        if (this.state.isLoading) {
          return (
            <View style={styles.loading_container}>
              <ActivityIndicator size='large' />
            </View>
          )
        }
      }

    _displayDetailForFilm = (idFilm) => {
        this.props.navigation.navigate("FilmDetail")
      }  

    render() {
        return (
            <View style={styles.main_container}>
                <TextInput 
                    style={styles.textinput}
                    placeholder="Titre du film"
                    onChangeText= {(text) => this._searchTextInputChanged(text)}
                    onSubmitEditing={() => this._loadFilms()} //activer la touche enter du clavier
                />
                <Button title="Rechercher" onPress={() =>this._loadFilms()}/>

                <FlatList
                    data={this.state.films}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        if (this.page < this.totalPages) { // On vérifie qu'on n'a pas atteint la fin de la pagination (totalPages) avant de charger plus d'éléments
                            this._loadFilms()
                        }
                    }}
                    renderItem={({item}) => <FilmItem film={item} displayDetailForFilm={this._displayDetailForFilm} />}
                />
                {this._displayLoading()}                                                     
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
    },
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }
})

export default Search