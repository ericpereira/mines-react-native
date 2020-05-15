import React from 'react'
import { View, StyleSheet } from 'react-native'
import Field from './Field'

export default props => {
    //faz um map para transformar cada elemento da matriz de board em um jsx
    const rows = props.board.map((row, r) => {
        const columns = row.map((field, c) => {
            return <Field {...field} key={c}
                onOpen={() => props.onOpenField(r, c)}
                onSelect={() => props.onSelectField(r, c)} />
        })
        //a view vai receber todas as colunas
        return <View
                    key={r}
                    style={{flexDirection: 'row'}}>{columns}</View>
    })
    //view que vai receber todas as linhas
    return <View style={styles.container} >{rows}</View>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#eee',
    }
})