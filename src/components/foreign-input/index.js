import React from 'react';

import { TextField } from "@material-ui/core"
import Autocomplete, {createFilterOptions } from '@material-ui/lab/Autocomplete';

const filter = createFilterOptions();

export default function ForeignInput(props) {
    const [ options, setOptions ] = React.useState([])

    React.useEffect(() => {
        if(props.options){
            setOptions(props.options)
        }
    }, [props.options])
    return (
        <Autocomplete
            value={props.value}
            options={options}

            onChange={(event, newValue) => {

                if (typeof newValue === 'string') {
                    if(props.onChange) props.onChange(newValue)
                    
                } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input

                    if(props.onChange) props.onChange(newValue.inputValue)

                    let opts = options.slice();
                    opts.push({title: newValue.inputValue})
                    setOptions(opts);
                    if(props.onOptionsChange) props.onOptionsChange(opts, newValue.inputValue)
                } else {
                    if(props.onChange) props.onChange(newValue)
                }
            }}
            getOptionLabel={(option) => {
                if (typeof option === 'string') {
                    return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                    return option.inputValue;
                }
                // Regular option
                return option.title;
            }}
            renderOption={(option) => option.title}
            freeSolo
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                // Suggest the creation of a new value
                if (params.inputValue !== '') {
                    filtered.push({
                        inputValue: params.inputValue,
                        title: `Add "${params.inputValue}"`,
                    });
                }

                return filtered;
            }}
            renderInput={(params) => {
                return <TextField {...params} label={props.label} />
            }} />
    )
}