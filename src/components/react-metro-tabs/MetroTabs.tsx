import React, { useEffect, useState, useRef } from "react";
import Hammer from "react-hammerjs";
import Tab from "./Tab/Index";

import { IMetroTabs } from "../Types/MetroTabs.types";

export const MetroTabContext = React.createContext<IMetroTabs>({});

export const MetroTabs = (props: IMetroTabs) => {
  const {
    children,
    transitionDuration = 1000,
    tabSpaces = 70,
    tabsColor = "#000",
    tabFontSize = "2.5em",
    tabFontWeight = "normal",
    transitionTimingFunction = "ease",
    onTabChange,
  } = props;

  let contextValue: IMetroTabs = {
    transitionDuration,
    tabSpaces,
    tabsColor,
    tabFontSize,
    transitionTimingFunction,
    onTabChange,
    tabFontWeight,
  };

  let renderItems = [];

  const padding = 5,
    margin = 0;

  if (children?.length > 0) {
    children.forEach((element: any) => {
      if (element.type === Tab) {
        renderItems.push(element);
      }
    });
  } else {
    if (children?.type === Tab) renderItems.push(children);
  }

  let titles: Array<string> = [];

  renderItems.forEach((element: any) => {
    titles.push(element.props.title);
  });

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const titlesContainer = document.getElementById("titles-container");
    const contentContainer = document.getElementById("content-container");

    const tabEl = document.getElementById("metro-tab" + activeTab);
    const firstTabEl = document.getElementById("metro-tab0");

    const contentEl = document.getElementById("metro-content" + activeTab);
    const firstContentEl = document.getElementById("metro-content0");

    if (
      tabEl &&
      firstTabEl &&
      titlesContainer &&
      contentContainer &&
      contentEl &&
      firstContentEl
    ) {
      const offsetLeftTitle =
        tabEl.getBoundingClientRect().left -
        firstTabEl.getBoundingClientRect().left;
      titlesContainer.style.transform =
        "translateX(-" + offsetLeftTitle + "px)";

      const offsetLeftContent =
        contentEl.getBoundingClientRect().left -
        firstContentEl.getBoundingClientRect().left;
      contentContainer.style.transform =
        "translateX(-" + offsetLeftContent + "px)";
    }
  }, [activeTab]);

  const handleClickTab = (index: number) => {
    if (onTabChange) {
      onTabChange({
        type: "press",
        prevIndex: activeTab,
        currentIndex: index,
        currentTabTitle: titles[index],
      });
    }

    setActiveTab(index);
  };

  const handleSwipe = (e: { direction: number }) => {
    if (e.direction === 2 && activeTab < titles.length - 1) {
      setActiveTab(activeTab + 1);
      if (onTabChange) {
        onTabChange({
          type: "swipe",
          direction: "right",
          prevIndex: activeTab,
          currentIndex: activeTab + 1,
          currentTabTitle: titles[activeTab + 1],
        });
      }
    }

    if (e.direction === 4 && activeTab > 0) {
      setActiveTab(activeTab - 1);
      if (onTabChange) {
        onTabChange({
          type: "swipe",
          direction: "left",
          prevIndex: activeTab,
          currentIndex: activeTab - 1,
          currentTabTitle: titles[activeTab - 1],
        });
      }
    }
  };

  return (
    <MetroTabContext.Provider value={contextValue}>
      <Hammer onSwipe={handleSwipe}>
        <div
          style={{
            overflow: "hidden",
            margin,
            height: "100%",
            maxHeight: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            id='titles-container'
            style={{
              position: "relative",
              left: padding,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              transition: "all " + transitionDuration / 1000 + "s",
              transitionTimingFunction,
              width: "100%",
            }}
          >
            {titles.map((item, index) => {
              return (
                <h1
                  id={"metro-tab" + index}
                  key={index}
                  style={{
                    marginRight: tabSpaces,
                    color: tabsColor,
                    opacity: activeTab === index ? "1" : "0.25",
                    cursor: "pointer",
                    transition: "all " + transitionDuration / 1000 + "s",
                    transitionTimingFunction,
                    whiteSpace: "nowrap",
                    fontSize: tabFontSize,
                    //@ts-ignore
                    fontWeight: tabFontWeight,
                  }}
                  onClick={() => handleClickTab(index)}
                >
                  {item}
                </h1>
              );
            })}
          </div>
          <div
            id='content-container'
            style={{
              position: "relative",
              left: padding,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              transition: "all " + transitionDuration / 1000 + "s",
              flex: 1,
            }}
          >
            {renderItems.map((item, index) => {
              return (
                <div
                  id={"metro-content" + index}
                  style={{
                    minWidth: "calc(100% - " + padding + "px)",
                    maxWidth: "calc(100% - " + padding + "px)",
                    height: "100%",
                  }}
                  key={index}
                >
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      </Hammer>
    </MetroTabContext.Provider>
  );
};

MetroTabs.Tab = Tab;

export { Tab as MetroTab };
