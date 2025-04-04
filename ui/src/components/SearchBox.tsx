import {FormEvent, useState} from 'react';
import {useNavigate} from "react-router-dom";

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
            <input 
                name='query' 
                type='search' 
                placeholder='Search...' 
                onChange={changeQuery}
                className="text-base border border-solid rounded-md py-1 px-2 w-full text-fg bg-bg"
            />
        </label>
    </form>;
};

export default SearchBox;