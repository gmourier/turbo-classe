import React from 'react';
import { InstantSearch, Configure, connectHits, connectHighlight, connectSearchBox} from 'react-instantsearch-dom';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import YoutubePlayer from 'react-youtube-player';

const searchClient = instantMeiliSearch(
    "https://sandbox-pool-gsl6q5i-3bsbgmeayb75w.ovh-fr-2.platformsh.site",
    "DvQXdjRANbJwTWRkIOxY"
);

const Hits = ({ hits }) => {
    const n = 3;
    const three = new Array(Math.ceil(hits.length / n))
        .fill()
        .map(_ => hits.splice(0, n))

    return (three.map(column => (
        <div className="columns">
            {column.map(hit => (
                <div className="column">
                    <Hit hit={hit} />
                </div>
            ))}
        </div>
    )))
}

const Hit = ({hit}) => {
    return (
        <div className="card" key={hit.id}>
            <div className="card-image">
                <YoutubePlayer
                    videoId={hit.video}
                    playbackState='unstarted'
                    configuration={
                        {
                            showinfo: 0,
                            controls: 1
                        }
                    }
                />
            </div>
            <div className="card-content">
                <CustomHighlight attribute="citation" hit={hit} />
            </div>
        </div>
    )
}

const Highlight = ({ highlight, attribute, hit }) => {
    const parsedHit = highlight({
        highlightProperty: '_highlightResult',
        attribute,
        hit,
    });

    return (
      <blockquote>
            <span>“</span>
            {parsedHit.map(
                (part, index) =>
                    part.isHighlighted ? (
                        <mark key={index}>
                            {" "}<span role="img" aria-label="emoji">🥊</span>&nbsp;&nbsp;{part.value}
                        </mark>
                    ) : (
                        <span key={index} className="is-family-code">
                            {part.value}
                        </span>
                    )
                )
            }
            <span>”</span>
      </blockquote>
    );
};

const SearchBox = ({ currentRefinement, refine }) => (
    <input
        className="input mb-6"
        placeholder="Yep."
        type="search"
        value={currentRefinement}
        onChange={event => refine(event.currentTarget.value)}
    />
);

const App = () => {
    return (
        <section className="section">
            <div className="container">
                <p className="has-text-centered is-size-1 mb-6">Turbo Classe</p>
                <InstantSearch
                    indexName="quote"
                    searchClient={searchClient}
                >
                    <Configure
                        hitsPerPage={30}
                        attibutesToHighlight={["citation"]}
                    />
                    <CustomSearchBox
                        defaultRefinement="Abitbol"
                    />
                    <CustomHits />
                </InstantSearch>
            </div>
        </section>
    )
}

const CustomHits = connectHits(Hits);
const CustomHighlight = connectHighlight(Highlight);
const CustomSearchBox = connectSearchBox(SearchBox);

export default App