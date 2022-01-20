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
  Container,
  Loader,
  Card,
  Box,
  Collapse,
} from '@mantine/core';
import { RichTextEditor } from '@mantine/rte';
import { useNotifications } from '@mantine/notifications';

import {
  MixIcon,
  Pencil1Icon,
  GearIcon,
  CardStackIcon,
  CheckIcon,
} from '@modulz/radix-icons';
import CardsGallery from '../CardsGallary';

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
        <Box
          sx={{ minHeight: '70vh', display: 'grid', placeContent: 'center' }}
        >
          <Study />
        </Box>
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
                      ['h2', 'h3', 'h4'],
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
            <CardsGallery />
          </Tabs.Tab>
        </Tabs>
      </Tabs.Tab>
    </Tabs>
  );
};

const Study = () => {
  const { data, isLoading, error, dataUpdatedAt, refetch } = useQuery(
    '/api/flash-cards/study',
    async () => {
      try {
        const res = await axios.get('/api/flash-cards/study');
        return res.data as { cardsToStudy: FlashCardData[]; message: string };
      } catch (error) {
        const err = error as AxiosError;
        if (err.response) {
          throw new Error(err.response.data.message);
        }
      }
    }
  );
  const [updatedAt, setUpdatedAt] = React.useState(dataUpdatedAt);

  const errorMessage = (error as Error | undefined)?.message;
  if (error) {
    return <div>{errorMessage}</div>;
  }

  if (isLoading) {
    return (
      <Container sx={{ paddingTop: '2rem' }}>
        <Center>
          <Loader variant="bars" />
        </Center>
      </Container>
    );
  }

  const { cardsToStudy, message } = data;
  if (message.length > 0) {
    return (
      <Text align="center" color="green">
        {message}
      </Text>
    );
  } else if (cardsToStudy.length > 0) {
    return <CardQuestion cards={cardsToStudy} refetch={refetch} />;
  }
  return null;
};

export type CardQuestionProps = {
  cards: FlashCardData[];
  refetch: any;
};
const CardQuestion = ({ cards, refetch }: CardQuestionProps) => {
  const [cardsToStudy, setCardsToStudy] =
    React.useState<FlashCardData[]>(cards);
  const [btnsDisabled, setBtnsDisabled] = React.useState(false);
  const [opened, setOpen] = React.useState(false);

  const updateCardMutation = useMutation(
    (data: { id: number; answeredCorrectly: boolean }) => {
      return axios.patch(`/api/flash-cards/${id}`, data);
    },
    {
      onSettled: () => {
        setCardsToStudy(cardsToStudy.slice(1));
        setBtnsDisabled(false);
        setOpen(false);
      },
    }
  );

  React.useLayoutEffect(() => {
    if (cardsToStudy.length === 0) {
      refetch();
    }
  }, [cardsToStudy, refetch]);

  if (cardsToStudy.length === 0) {
    return null;
  }

  const { word, definition, id } = cardsToStudy[0];
  const handleSuccessClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setBtnsDisabled(true);
    updateCardMutation.mutate({ id, answeredCorrectly: true });
  };
  const handleFailureClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setBtnsDisabled(true);
    updateCardMutation.mutate({ id, answeredCorrectly: false });
  };

  if (updateCardMutation.isLoading) {
    return (
      <Container sx={{ paddingTop: '2rem' }}>
        <Center>
          <Loader variant="bars" />
        </Center>
      </Container>
    );
  }

  if (cardsToStudy.length > 0) {
    return (
      <Card shadow="lg" padding="lg" sx={{ width: '40ch', margin: 'auto' }}>
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
        <Button
          sx={{ width: '100%', margin: '1rem 0' }}
          onClick={() => setOpen((o) => !o)}
        >
          Show definition
        </Button>

        <Collapse in={opened}>
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
          <Group position="center">
            <Button
              variant="light"
              color="green"
              onClick={handleSuccessClick}
              disabled={btnsDisabled}
            >
              I got it
            </Button>
            <Button
              variant="light"
              color="red"
              onClick={handleFailureClick}
              disabled={btnsDisabled}
            >
              I didn't get it
            </Button>
          </Group>
        </Collapse>
      </Card>
    );
  }

  return null;
};

export default HomeTabs;
