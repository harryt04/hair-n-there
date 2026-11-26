"use client";

import { Children, useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Heart, Palette, Scissors, Sparkles } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button, buttonVariants } from "@/components/ui/button";
import { serviceGuideGoals, serviceGuidePaths } from "@/data/service-guide";
import styles from "./service-guide.module.css";

const icons = { cut: Scissors, color: Palette, style: Sparkles, unsure: Heart };

export function ServiceGuideControls({ children }: { children: ReactNode }) {
  const prefix = useId();
  const [goalId, setGoalId] = useState<string | null>(null);
  const [pathId, setPathId] = useState<string | null>(null);
  const goal = serviceGuideGoals.find((item) => item.id === goalId);

  return (
    <>
      <ToggleGroup
        className={styles.goals}
        aria-label="Your hair goal"
        deselectable={false}
        value={goalId ? [goalId] : []}
        onValueChange={([nextGoal]) => {
          if (nextGoal) {
            setGoalId(nextGoal);
            setPathId(null);
          }
        }}
      >
        {serviceGuideGoals.map((item) => {
          const Icon = icons[item.id];
          return (
            <ToggleGroupItem
              key={item.id}
              value={item.id}
              className={styles.goal}
              aria-controls={`${prefix}-follow-up`}
            >
              <Icon
                className={styles.icon}
                aria-hidden="true"
                strokeWidth={1.6}
              />
              <span className={styles.goalTitle}>{item.title}</span>
              <span className={styles.goalCopy}>{item.description}</span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
      <div id={`${prefix}-follow-up`} aria-live="polite" aria-atomic="false">
        <section
          className={styles.followUp}
          hidden={!goal}
          aria-label="Find your services"
        >
          {goal?.id === "unsure" ? (
            <>
              <h3 className="text-xl">
                You don’t have to choose a service yet.
              </h3>
              <p className={styles.copy}>
                Tell Elisabeth what you’re thinking. She’ll help you find the
                right fit.
              </p>
              <Button
                nativeButton={false}
                render={<Link href="/contact" />}
                className={styles.contact}
              >
                Let’s figure it out together <ArrowUpRight aria-hidden="true" />
              </Button>
            </>
          ) : goal ? (
            <>
              <h3 className="text-xl">{goal.question}</h3>
              <ToggleGroup
                className={styles.choices}
                aria-label={goal.question}
                deselectable={false}
                value={pathId ? [pathId] : []}
                onValueChange={([nextPath]) => {
                  if (nextPath) setPathId(nextPath);
                }}
              >
                {serviceGuidePaths
                  .filter((path) =>
                    (goal.paths as readonly string[]).includes(path.id),
                  )
                  .map((path) => (
                    <ToggleGroupItem
                      key={path.id}
                      value={path.id}
                      aria-controls={`${prefix}-${path.id}`}
                      className={buttonVariants({
                        variant: "outline",
                        className: styles.choice,
                      })}
                    >
                      {path.label}
                    </ToggleGroupItem>
                  ))}
              </ToggleGroup>
            </>
          ) : null}
          {/* All menu panels arrive as server-rendered children, including before JS. */}
          {Children.map(children, (panel, index) => (
            <div
              id={`${prefix}-${serviceGuidePaths[index].id}`}
              hidden={pathId !== serviceGuidePaths[index].id}
            >
              {panel}
            </div>
          ))}
        </section>
      </div>
      <noscript>
        <p className={styles.copy}>
          You can{" "}
          <Link href="/pricing" className="underline underline-offset-4">
            browse all services & prices
          </Link>{" "}
          or get in touch with Elisabeth directly.
        </p>
      </noscript>
    </>
  );
}
