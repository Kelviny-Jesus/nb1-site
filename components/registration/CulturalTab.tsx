"use client";

import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useIntl } from "react-intl";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CulturalTabProps {
  touchedFields: Record<string, boolean>;
  markFieldAsTouched: (fieldName: string) => void;
}

const hobbies = [
  "reading",
  "writing",
  "painting",
  "drawing",
  "photography",
  "cooking",
  "traveling",
  "gaming",
  "music",
  "sports",
  "jogos",
  "academia",
  "baking",
  "gardening",
  "hiking",
  "camping",
  "fishing",
  "hunting",
  "swimming",
  "surfing",
  "skiing",
  "snowboarding",
  "cycling",
  "running",
  "yoga",
  "meditation",
  "dancing",
  "singing",
  "playing-instrument",
  "collecting",
  "learning-languages",
  "woodworking",
  "knitting",
  "sewing",
  "pottery",
  "sculpting",
  "bird-watching",
  "astronomy",
  "chess",
  "board-games",
  "video-games",
  "puzzles",
  "volunteering",
  "podcasting",
  "blogging",
];

const movieGenres = [
  "action",
  "adventure",
  "animation",
  "comedy",
  "crime",
  "documentary",
  "drama",
  "fantasy",
  "horror",
  "mystery",
  "romance",
  "science-fiction",
  "thriller",
  "western",
];

const seriesGenres = [
  "action",
  "adventure",
  "animation",
  "comedy",
  "crime",
  "documentary",
  "drama",
  "fantasy",
  "horror",
  "mystery",
  "romance",
  "science-fiction",
  "thriller",
  "western",
];

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  emptyMessage: string;
  label: string;
}

function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
  emptyMessage,
  label,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const { formatMessage } = useIntl();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-[60px] justify-between bg-[#1a1f36] border-gray-700 text-white hover:bg-[#2a2f46] relative"
        >
          <ScrollArea className="w-[calc(100%-2rem)] h-[48px] py-1">
            <div className="flex flex-wrap gap-1">
              {value.length === 0 ? (
                <span className="text-gray-500">{placeholder}</span>
              ) : (
                value.map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="bg-[#2a2f46] text-white whitespace-nowrap"
                  >
                    {formatMessage({ id: item })}
                  </Badge>
                ))
              )}
            </div>
          </ScrollArea>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 absolute right-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-[#1a1f36] border-gray-700">
        <Command className="bg-transparent">
          <CommandInput placeholder={placeholder} className="text-white" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-[300px]">
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    onSelect={() => {
                      onChange(
                        value.includes(option)
                          ? value.filter((item) => item !== option)
                          : [...value, option]
                      );
                    }}
                    className="text-white hover:bg-[#2a2f46]"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(option) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {formatMessage({ id: option })}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function CulturalTab({
  touchedFields,
  markFieldAsTouched,
}: CulturalTabProps) {
  const { formatMessage } = useIntl();
  const { control } = useFormContext();

  return (
    <div className="space-y-8">
      <div>
        <Label className="text-white mb-2 block text-lg">
          {formatMessage({ id: "hobbies" })}
        </Label>
        <Controller
          name="hobbies"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <MultiSelect
              options={hobbies}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                markFieldAsTouched("hobbies");
              }}
              placeholder={formatMessage({ id: "selectHobbies" })}
              emptyMessage={formatMessage({ id: "noHobbiesFound" })}
              label={formatMessage({ id: "hobbies" })}
            />
          )}
        />
      </div>

      <div>
        <Label className="text-white mb-2 block text-lg">
          {formatMessage({ id: "favoriteMovieGenres" })}
        </Label>
        <Controller
          name="favoriteMovieGenres"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <MultiSelect
              options={movieGenres}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                markFieldAsTouched("favoriteMovieGenres");
              }}
              placeholder={formatMessage({ id: "selectMovieGenres" })}
              emptyMessage={formatMessage({ id: "noGenresFound" })}
              label={formatMessage({ id: "favoriteMovieGenres" })}
            />
          )}
        />
      </div>

      <div>
        <Label className="text-white mb-2 block text-lg">
          {formatMessage({ id: "favoriteSeriesGenres" })}
        </Label>
        <Controller
          name="favoriteSeriesGenres"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <MultiSelect
              options={seriesGenres}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                markFieldAsTouched("favoriteSeriesGenres");
              }}
              placeholder={formatMessage({ id: "selectSeriesGenres" })}
              emptyMessage={formatMessage({ id: "noGenresFound" })}
              label={formatMessage({ id: "favoriteSeriesGenres" })}
            />
          )}
        />
      </div>
    </div>
  );
}
