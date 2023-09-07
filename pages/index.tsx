import type { NextPage } from "next";
import { useRouter } from "next/router"
import Link from 'next/link';
import { useEffect, useState, useRef, createContext, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { fetchEntries } from './api/contentful';
import { fetchSearch } from './api/algolia';
import { Metadata, EntrySys, EntryFields } from "./types/items";
import { Article as ArticleItem } from "./types/news";
import { DetailContext } from './context/DetailProvider';
import { Box, Card, Typography, Stack, Grid, InputBase } from "@mui/material";
import { useDebounce } from 'use-debounce';
import useEndScreen from "./hooks/useEndScreen";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

type EntryItem = {
  metadata: Metadata;
  sys: EntrySys;
  fields: EntryFields;
}

type Result = {
  data: ArticleItem[];
  page: number;
  loading: boolean;
  total: number;
  endOfPage: boolean;
};

export const convertDate = (date: string) => {
  const dateObject = new Date(date);
  // Define an array of month names
  const year = dateObject.getFullYear();
  const month = monthNames[dateObject.getMonth()];
  const day = dateObject.getDate();

  return `${month} ${day}, ${year}`;
}

export async function getStaticProps() {
  const items = await fetchEntries();
  const news = await fetchSearch('', '', 0);
  return {
    props: {
      items,
      news: news.hits,
    },
  };
}

const Home: NextPage<{ items: EntryItem[], news: ArticleItem[], }> = ({items, news}) => {
  const activeItem = items[0]
  const logoUrl = activeItem?.fields?.logo?.fields?.file?.url
  const router = useRouter();
  const { search } = router.query;
  const activeSearch = search ?? ''
  const [result, setResult] = useState<Result>({data: [], page: 1, loading: true, total: 0, endOfPage: false});
  const [resultOriginal, setResultOriginal] = useState<Result>({data: [], page: 1, loading: true, total: 0, endOfPage: false});
  const [searchActive, setSearchActive] = useState<Boolean>(false);
  const [keywords, setKeywords] = useState<string>('');
  const [newKeywords] = useDebounce(keywords, 300);
  const elementRef = useRef<HTMLDivElement>(null);
  const {endScreen, setEndScreen} = useEndScreen(elementRef);
  const { setData } = useContext(DetailContext);

  const onChangeSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if(value.length){
      setKeywords(value)
      return;
    }
    setKeywords('');
  }

  const searchNews = async (query: string, page: number) => {
    setResult((prev: Result) => ({
      ...prev,
      loading: true,
    }));
    setEndScreen(false);
    const news = await fetchSearch(query, ``, page);
    if(news.hits.length > 0){
      router.push({
        pathname: "/",
        query: {
          search: query,
        }
      })

      setResult((prev: Result) => {
        const set = new Set();
        const theData = prev.data.concat(news.hits as ArticleItem[])
        const newData = theData.filter(item => {
          const duplicateId = set.has(item.slug);
          set.add(item.slug);
          return !duplicateId;
        });
        return({...prev,
          data: newData,
          loading: false,
          page,
          total: news.nbHits,
          endOfPage: page === news.nbPages - 1
        })
      });
      setSearchActive(true);
      if(page === news.nbPages - 1){
        setEndScreen(true);
        return;
      }
      setEndScreen(false);
      return
    }
    setSearchActive(false);
    setResult((prev: Result) => ({...prev,
      data: [],
      loading: false,
      page,
      total: 0,
    }));
    if(page === news.nbPages){
      setEndScreen(true);
      return;
    }
  }

  const initializeNews = async (page: number) => {
    setResultOriginal((prev: Result) => ({...prev,
      loading: true,
    }));
    setEndScreen(false);
    const news = await fetchSearch(``, ``, page);
    const data = page === 0 ? news.hits.splice(3) : news.hits
    setResultOriginal((prev: Result) => {
      const set = new Set();
      const theData = prev.data.concat(data as ArticleItem[])
      const newData = theData.filter(item => {
        const duplicateId = set.has(item.slug);
        set.add(item.slug);
        return !duplicateId;
      });
      return({...prev,
        data: newData,
        loading: false,
        page,
        total: news.nbHits,
        endOfPage: page === news.nbPages - 1
      })
    });
    if(page === news.nbPages - 1){
      setEndScreen(true);
      return;
    }
  }

  useEffect(() => {
    if(newKeywords.length || (activeSearch.toString().length && newKeywords.length === 0)){
      const activeKeyWords = newKeywords || activeSearch.toString()
      if(activeSearch.toString().length && newKeywords.length === 0){
        setKeywords(activeKeyWords);
      }
      searchNews(activeKeyWords, 0)
    }
  }, [newKeywords, activeSearch]);

  useEffect(() => {
    initializeNews(0);
  }, [])

  useEffect(() => {
    if(!result.loading && endScreen && searchActive && !result.endOfPage){
      const newPage = result.page +1
      searchNews(newKeywords, newPage)
      return;
    }

    if(!resultOriginal.loading && endScreen && !searchActive && !resultOriginal.endOfPage){
      const newPage = resultOriginal.page +1
      initializeNews(newPage)
      return;
    }
  }, [endScreen,
      searchActive,
      result.loading,
      resultOriginal.loading,
      result.page,
      resultOriginal.page,
      result.endOfPage,
      resultOriginal.endOfPage,
    ])

  const activeData = searchActive ? result.data : resultOriginal.data
  const activeLoading = searchActive ? result.loading : resultOriginal.loading
  const activeEndPage = searchActive ? result.endOfPage : resultOriginal.endOfPage

  return (
    <>
      <Head>
        <title>CredibleMind</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box className="header">
        <div className="logo-wrapper"><img alt="Logo" src={logoUrl} /></div>
        <hr/>
        <nav><ul><li>{activeItem?.fields?.menuLabel}</li></ul></nav>
      </Box>
      <Box className="highlight-news">
        <h2>{activeItem?.fields?.ttile}</h2>
        <Box className="news-card-wrapper" sx={{display: 'flex'}}>
          {
            news.map(item => {
              return(
                <Card onClick={() => {setData(item)}} className="news-card" key={item.slug}>
                  <Box sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
                    <Link href={`/news/${item.name}`}>
                      <img style={{cursor: 'pointer'}} className="news-card-image" src={item.imageUrl} alt={item.name} />
                    </Link>
                    <Stack sx={{p: 0}} spacing={2}>
                      {
                        item.topics.map(itemTopic => {
                          return(
                            <Link href={`/?search=${itemTopic.title}`}>
                              <Typography style={{cursor: 'pointer'}} key={itemTopic.id} className="topic">
                                {itemTopic.title}
                              </Typography>
                            </Link>
                          )
                        })
                      }
                        <Link href={`/news/${item.name}`}>
                          <Typography style={{cursor: 'pointer'}} fontWeight={700}>{item.name}</Typography>
                        </Link>
                      <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography className="date">{convertDate(item.publicationDate)}</Typography>
                        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                        {
                          item.organization.map(itemOrganization => {
                            return(
                              <Typography key={itemOrganization.fields.slug} className="organization">{itemOrganization.fields.name}</Typography>
                            )
                          })
                        }
                      </Box>
                    </Stack>
                  </Box>
                </Card>
              )
            }).slice(0, 3)
          }
        </Box>
        <Box className="list-news">
          <Grid className="list-container" container>
            <Grid item xs={3}>
              <Box sx={{p: 2.5, border: '1px solid #eee'}}>
                {activeItem.fields.searchLabel}
                <Box sx={{mt: '1rem', display: 'flex'}}>
                  <InputBase
                    onChange={onChangeSearch}
                    sx={{
                      flex: 1, 
                      border: '1px solid #eee', 
                      borderRight: '0px',
                      padding: '4px'
                    }}
                    placeholder="Search"
                    inputProps={{ 'aria-label': 'search google maps' }}
                  />
                  <IconButton 
                    type="button" 
                    sx={{
                      border: '0.75px solid #02619c',
                      borderRadius: 0,
                      padding: '8px',
                      background: '#02619c',
                      color: '#fff'
                    }} 
                    aria-label="search">
                    <SearchIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
            <Grid 
              item
              sx={{
                paddingLeft: '2rem',
                paddingRight: '2rem'
              }}
              className="list-container-grid"
              xs={9}>
              <Typography fontWeight={700}>{result.total > 0 ? `${result.total} Resources found` : ``}</Typography>
              <Box sx={{
                p: 0,
                display: 'flex',
                marginBottom: '1.5rem',
                borderBottom: '1px solid #eee',
                paddingBottom: '0rem'
              }}/>
              {activeData.map((item, index) => {
                return(
                  <Box
                    onClick={() => {setData(item)}}
                    key={item.slug}
                    sx={{
                      p: 0,
                      display: 'flex',
                      marginBottom: '1.5rem',
                      borderBottom: '1px solid #eee',
                      paddingBottom: '1.5rem'
                    }}>
                    <Link href={`/news/${item.name}`}>
                      <img style={{cursor: 'pointer'}} className="list-news-card-image" src={item.imageUrl} alt={item.name} />
                    </Link>
                    <Stack sx={{p: 0}} spacing={2}>
                      {
                        item.topics.map(itemTopic => {
                          return(
                            <Link href={`/?search=${itemTopic.title}`}>
                              <Typography style={{cursor: 'pointer'}} key={itemTopic.id} className="topic">
                                {itemTopic.title}
                              </Typography>
                            </Link>
                          )
                        })
                      }
                      <Link href={`/news/${item.name}`}>
                        <Typography style={{cursor: 'pointer'}} fontWeight={700}>{item.name}</Typography>
                      </Link>
                      <Typography className="description">{item.description}</Typography>
                      <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography className="date">{convertDate(item.publicationDate)}</Typography>
                        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                        {
                          item.organization.map(itemOrganization => {
                            return(
                              <Typography key={itemOrganization.fields.slug} className="organization">{itemOrganization.fields.name}</Typography>
                            )
                          })
                        }
                      </Box>
                    </Stack>
                  </Box>
                )
              })}
              {activeLoading && (<>Loading data</>)}
              {activeEndPage && (<>No more data to load</>)}
              <div style={{height: '20px', marginTop: 'auto'}} ref={elementRef}/>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Home;
