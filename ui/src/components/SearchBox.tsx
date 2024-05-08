import {FormEvent, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {SearchInput} from "../styled/SearchInput.tsx";

const SearchBox = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    if (search) {
        navigate('/entries?' + search);
        setSearch('');
        return <></>;
    }
    const changeQuery = (event: FormEvent<HTMLInputElement>) => setQuery(event.currentTarget.value);
    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const params = new URLSearchParams();
        params.set('query', query);
        setSearch(params.toString());
    };
    return <form onSubmit={submit}>
        <label>
            <SearchInput name='query' type='search' placeholder='Search...' onChange={changeQuery}/>
        </label>
    </form>;
};

export default SearchBox;