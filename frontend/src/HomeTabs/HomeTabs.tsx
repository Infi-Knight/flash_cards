import * as React from 'react';
import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { Tabs, Center, TextInput, Group, Button, Text } from '@mantine/core';
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

export default HomeTabs;
