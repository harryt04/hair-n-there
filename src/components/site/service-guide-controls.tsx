"use client";

import { Children, useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Heart, Palette, Scissors, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className={styles.goals} role="group" aria-label="Your hair goal">
        {serviceGuideGoals.map((item) => {
          const Icon = icons[item.id];
          return (
            <button
              key={item.id}
              type="button"
              className={styles.goal}
              aria-pressed={goalId === item.id}
              aria-controls={`${prefix}-follow-up`}
              onClick={() => {
                setGoalId(item.id);
                setPathId(null);
              }}
            >
              <Icon
                className={styles.icon}
                aria-hidden="true"
                strokeWidth={1.6}
              />
              <span className={styles.goalTitle}>{item.title}</span>
              <span className={styles.goalCopy}>{item.description}</span>
            </button>
          );
        })}
      </div>
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
              <div
                className={styles.choices}
                role="group"
                aria-label={goal.question}
              >
                {serviceGuidePaths
                  .filter((path) =>
                    (goal.paths as readonly string[]).includes(path.id),
                  )
                  .map((path) => (
                    <Button
                      key={path.id}
                      type="button"
                      variant="outline"
                      aria-pressed={pathId === path.id}
                      aria-controls={`${prefix}-${path.id}`}
                      className={styles.choice}
                      onClick={() => setPathId(path.id)}
                    >
                      {path.label}
                    </Button>
                  ))}
              </div>
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
