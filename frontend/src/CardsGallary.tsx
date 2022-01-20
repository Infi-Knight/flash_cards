import * as React from 'react';

import axios, { AxiosError } from 'axios';
import { useMutation, useQuery } from 'react-query';
import {
  Text,
  Grid,
  Container,
  Box,
  Loader,
  Card,
  Center,
  Tooltip,
  ThemeIcon,
} from '@mantine/core';
import { RichTextEditor } from '@mantine/rte';

import Countdown from 'react-countdown';
import { LapTimerIcon, Cross2Icon, RocketIcon } from '@modulz/radix-icons';
import { FlashCardData } from './HomeTabs/HomeTabs';

function resizeGridItem(item) {
  let grid = document.querySelectorAll('#grid-content')[0];
  const rowHeight = parseInt(
    window.getComputedStyle(grid).getPropertyValue('grid-auto-rows')
  );
  const rowGap = parseInt(
    window.getComputedStyle(grid).getPropertyValue('grid-row-gap')
  );
  const rowSpan = Math.ceil(
    (item.querySelector('.content').getBoundingClientRect().height + rowGap) /
      (rowHeight + rowGap)
  );
  item.style.gridRowEnd = 'span ' + rowSpan;
}

function resizeAllGridItems() {
  const allItems = document.getElementsByClassName('item');
  for (let x = 0; x < allItems.length; x++) {
    resizeGridItem(allItems[x]);
  }
}
const CardsGallery = () => {
  return (
    <Container sx={{ paddingTop: '2rem' }}>
      <Cards />
    </Container>
  );
};

const Cards = () => {
  const allWordsQuery = useQuery('/api/flash-cards', async () => {
    try {
      const res = await axios.get('/api/flash-cards');
      return res.data as FlashCardData[];
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        throw new Error(err.response.data.message);
      }
    }
  });

  React.useEffect(() => {
    window.addEventListener('resize', resizeAllGridItems);
    return () => window.removeEventListener('resize', resizeAllGridItems);
  }, []);

  React.useEffect(() => {
    window.requestAnimationFrame(resizeAllGridItems);
  });

  const { data, isLoading, error } = allWordsQuery;

  const errorMessage = (error as Error | undefined)?.message;
  if (isLoading) {
    return (
      <Container sx={{ paddingTop: '2rem' }}>
        <Center>
          <Loader variant="bars" />
        </Center>
      </Container>
    );
  }

  if (error) {
    return <div>{errorMessage}</div>;
  }

  return (
    <Box
      id="grid-content"
      sx={{
        display: 'grid',
        gap: '1rem',
        gridAutoRows: '1rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        '@media screen and (max-width: 500px)': {
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        },
      }}
    >
      {data.map((card) => {
        return (
          <div className="item" key={card.word}>
            <FlashCard card={card} />
          </div>
        );
      })}
    </Box>
  );
};

export type FlashCardProps = {
  card: FlashCardData;
};
const FlashCard = React.memo(function FlashCard({ card }: FlashCardProps) {
  const { word, definition, bin, nextAppearanceAt, wrongCount } = card;
  return (
    <Card shadow="lg" padding="lg" className="content">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Text
          align="center"
          color="pink"
          sx={{
            fontFamily: `'Playfair Display', serif`,
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        >
          {word}
        </Text>
        <RichTextEditor
          sx={{
            overflowX: 'auto',
            border: '0',
            '& .ql-editor': {
              padding: '0',
              '& h2, h3, h4': {
                fontFamily: `'Playfair Display', serif`,
              },
            },
          }}
          onChange={() => {}}
          value={definition}
          readOnly
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Tooltip label="time to next appearance">
              <ThemeIcon variant="light" color="orange">
                <LapTimerIcon />
              </ThemeIcon>
            </Tooltip>
            <Box>
              <Countdown autoStart={true} date={nextAppearanceAt} />
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Tooltip label="bin">
              <ThemeIcon variant="light" color="green">
                <RocketIcon />
              </ThemeIcon>
            </Tooltip>
            <Text>{bin}</Text>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Tooltip label="# of times answered incorrect">
              <ThemeIcon variant="light" color="red">
                <Cross2Icon />
              </ThemeIcon>
            </Tooltip>
            <Text>{wrongCount}</Text>
          </Box>
        </Box>
      </Box>
    </Card>
  );
});

export default CardsGallery;
