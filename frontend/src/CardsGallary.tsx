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

const CardsGallery = React.memo(function CardsContainer() {
  return (
    <Container>
      <Cards />
    </Container>
  );
});

const Cards = React.memo(function Cards() {
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
    <Grid>
      {data.map((card) => {
        return (
          <Grid.Col md={6} key={card.id}>
            <FlashCard card={card} />
          </Grid.Col>
        );
      })}
    </Grid>
  );
});

export type FlashCardProps = {
  card: FlashCardData;
};
const FlashCard = React.memo(function FlashCard({ card }: FlashCardProps) {
  const { word, definition, bin, nextAppearanceAt, wrongCount } = card;
  return (
    <Card shadow="lg" padding="lg">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Text
          align="center"
          color="blue"
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
              <Countdown date={nextAppearanceAt} />
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
