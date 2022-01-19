import * as React from 'react';
import axios, { AxiosError } from 'axios';
import { useMutation, useQuery } from 'react-query';
import {
  Tabs,
  Center,
  TextInput,
  Group,
  Button,
  Text,
  Grid,
  Container,
  Box,
  Loader,
  Card,
  ThemeIcon,
} from '@mantine/core';
import { RichTextEditor } from '@mantine/rte';
import { useNotifications } from '@mantine/notifications';
import Countdown from 'react-countdown';

import {
  MixIcon,
  Pencil1Icon,
  GearIcon,
  CardStackIcon,
  CheckIcon,
  LapTimerIcon,
  Cross2Icon,
  RocketIcon,
} from '@modulz/radix-icons';

export type FlashCardData = {
  word: string;
  definition: string;
  bin: number;
  id: number;
  nextAppearanceAt: string;
  wrongCount: number;
};

const HomeTabs = () => {
  const notifications = useNotifications();
  const [word, setWord] = React.useState('');
  const [definition, setDefinition] = React.useState('');

  const addWordMutation = useMutation(
    async (data: { word: string; definition: string }) => {
      try {
        return await axios.post('/api/flash-cards', data);
      } catch (error) {
        const err = error as AxiosError;
        if (err.response) {
          throw new Error(err.response.data.message);
        }
      }
    },
    {
      onSuccess: () => {
        notifications.showNotification({
          id: 'flash-card-added-notification',
          message: 'Card added successfully',
          color: 'green',
          icon: <CheckIcon />,
          autoClose: 3000,
        });
        setWord('');
        setDefinition('');
      },
    }
  );

  const handleWordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (word && definition) {
      addWordMutation.mutate({ word, definition });
    }
  };
  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value);
  };
  const handleDefinitionChange = (value: string) => {
    setDefinition(value);
  };
  const handleWordInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (addWordMutation.error) {
      addWordMutation.reset();
    }
  };

  const errorMessage = (addWordMutation.error as Error | undefined)?.message;

  return (
    <Tabs variant="outline">
      <Tabs.Tab label="Study" icon={<MixIcon />}>
        Gallery tab content
      </Tabs.Tab>
      <Tabs.Tab label="Admin" icon={<GearIcon />}>
        <Tabs>
          <Tabs.Tab label="Add Word" icon={<Pencil1Icon />}>
            <form onSubmit={handleWordSubmit}>
              <Center>
                <Group direction="column">
                  <TextInput
                    label="Word"
                    value={word}
                    onChange={handleWordChange}
                    error={errorMessage}
                    onFocus={handleWordInputFocus}
                  />
                  <Text size="sm" weight="500">
                    Definition
                  </Text>
                  <RichTextEditor
                    value={definition}
                    onChange={handleDefinitionChange}
                    controls={[
                      ['h1', 'h2', 'h3', 'h4'],
                      ['bold', 'strike', 'italic', 'underline', 'link'],
                      ['clean'],
                      ['unorderedList', 'orderedList'],
                      ['alignLeft', 'alignCenter', 'alignRight'],
                    ]}
                    onImageUpload={(file: File) => {
                      // we are not providing image upload facility
                      return new Promise((resolve, reject) => {
                        resolve('');
                      });
                    }}
                  />
                  <Button
                    variant="gradient"
                    gradient={{ from: 'grape', to: 'pink', deg: 35 }}
                    type="submit"
                    loading={addWordMutation.isLoading ? true : false}
                    style={{ margin: '0 auto' }}
                  >
                    Submit
                  </Button>
                </Group>
              </Center>
            </form>
          </Tabs.Tab>
          <Tabs.Tab label="View Cards" icon={<CardStackIcon />}>
            <Container>
              <Cards />
            </Container>
          </Tabs.Tab>
        </Tabs>
      </Tabs.Tab>
    </Tabs>
  );
};

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
  const { word, definition, bin, id, nextAppearanceAt, wrongCount } = card;
  console.log(wrongCount);
  return (
    <Card shadow="sm" padding="lg">
      {word}
      <RichTextEditor
        sx={{ border: '0', '& .ql-editor': { padding: '0' } }}
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
          <ThemeIcon variant="light" color="orange">
            <LapTimerIcon />
          </ThemeIcon>
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
          <ThemeIcon variant="light" color="green">
            <RocketIcon />
          </ThemeIcon>
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
          <ThemeIcon variant="light" color="red">
            <Cross2Icon />
          </ThemeIcon>
          <Text>{wrongCount}</Text>
        </Box>
      </Box>
    </Card>
  );
});
export default HomeTabs;
