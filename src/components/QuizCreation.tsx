"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useForm } from "react-hook-form";
import { quizCreationSchema, QuizCreationSchema } from "@/schemas/form/quiz";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  CopyCheck,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingQuestions from "./LoadingQuestions";
import { commonTopics, filterTopics } from "@/lib/topics";

type Props = {
  topicParam: string;
};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = ({ topicParam }: Props) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = React.useState(false);
  const [finishedLoading, setFinishedLoading] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [filteredTopics, setFilteredTopics] = React.useState<string[]>([]);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const { mutate: getQuestions, isPending } = useMutation({
    mutationFn: async ({
      amount,
      topic,
      type,
      difficulty,
    }: QuizCreationSchema) => {
      const response = await axios.post("/api/quiz", {
        amount,
        topic,
        type,
        difficulty,
      });
      return response.data;
    },
  });

  const form = useForm<QuizCreationSchema>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      amount: 3,
      topic: topicParam,
      type: "mcq",
      difficulty: "intermediate",
    },
  });

  // Filter topics based on input
  React.useEffect(() => {
    const currentTopic = form.getValues("topic");
    setFilteredTopics(filterTopics(currentTopic, commonTopics));
  }, [form.watch("topic")]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function onSubmit(input: QuizCreationSchema) {
    setShowLoader(true);
    getQuestions(input, {
      onSuccess: ({ quizId }) => {
        setFinishedLoading(true);
        setTimeout(() => {
          if (form.getValues("type") === "mcq") {
            router.push(`/take-quiz/mcq/${quizId}`);
          } else if (form.getValues("type") === "open_ended") {
            router.push(`/take-quiz/open-ended/${quizId}`);
          }
        }, 2000);
      },
      onError: () => {
        setShowLoader(false);
      },
    });
  }

  const handleTopicSelect = (topic: string) => {
    form.setValue("topic", topic);
    setShowDropdown(false);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  if (showLoader) {
    return <LoadingQuestions finished={finishedLoading} />;
  }

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2x font-bold">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <div className="relative" ref={dropdownRef}>
                        <Input
                          placeholder="Enter a topic or choose from suggestions..."
                          {...field}
                          onFocus={handleInputFocus}
                          onChange={(e) => {
                            field.onChange(e);
                            setShowDropdown(true);
                          }}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowDropdown(!showDropdown)}
                        >
                          {showDropdown ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>

                        {showDropdown && filteredTopics.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredTopics.map((topic) => (
                              <div
                                key={topic}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                                onClick={() => handleTopicSelect(topic)}
                              >
                                {topic}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Start typing or choose from common topics
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of questions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter number of questions..."
                        {...field}
                        onChange={(e) => {
                          form.setValue("amount", parseInt(e.target.value));
                        }}
                        type="number"
                        min={1}
                        max={10}
                      />
                    </FormControl>
                    <FormDescription>
                      Choose between 1 and 10 questions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <div className="flex justify-between">
                      <Button
                        className="w-1/3 rounded-none rounded-l-lg"
                        variant={
                          form.getValues("difficulty") === "easy"
                            ? "default"
                            : "secondary"
                        }
                        onClick={() => form.setValue("difficulty", "easy")}
                        type="button"
                      >
                        Easy
                      </Button>
                      <Separator orientation="vertical" />
                      <Button
                        className="w-1/3 rounded-none"
                        variant={
                          form.getValues("difficulty") === "intermediate"
                            ? "default"
                            : "secondary"
                        }
                        onClick={() =>
                          form.setValue("difficulty", "intermediate")
                        }
                        type="button"
                      >
                        Intermediate
                      </Button>
                      <Separator orientation="vertical" />
                      <Button
                        className="w-1/3 rounded-none rounded-r-lg"
                        variant={
                          form.getValues("difficulty") === "hard"
                            ? "default"
                            : "secondary"
                        }
                        onClick={() => form.setValue("difficulty", "hard")}
                        type="button"
                      >
                        Hard
                      </Button>
                    </div>
                    <FormDescription>
                      Choose the quiz difficulty
                    </FormDescription>
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button
                  className="w-1/2 rounded-none rounded-l-lg"
                  variant={
                    form.getValues("type") === "mcq" ? "default" : "secondary"
                  }
                  onClick={() => {
                    form.setValue("type", "mcq");
                  }}
                  type="button"
                >
                  <CopyCheck className="w-4 h-4 mr-2" /> Multiple Choice
                </Button>
                <Separator orientation="vertical" />
                <Button
                  className="w-1/2 rounded-none rounded-r-lg"
                  variant={
                    form.getValues("type") === "open_ended"
                      ? "default"
                      : "secondary"
                  }
                  onClick={() => {
                    form.setValue("type", "open_ended");
                  }}
                  type="button"
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Open Ended
                </Button>
              </div>

              <Button disabled={isPending} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCreation;
