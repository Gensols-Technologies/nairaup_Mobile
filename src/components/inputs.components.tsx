import { InputProps, Input as RNEInput } from "@rneui/themed";
import React, { JSX, useEffect, useMemo, useRef, useState } from "react";
import {
  BlurEvent,
  ColorValue,
  FocusEvent,
  StyleProp,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
  StyleSheet,
  ActivityIndicator,
  TextProps,
  TextInputProps,
  Platform,
} from "react-native";
import layoutConstants from "src/constants/layout.constants";
import { useAppTheme } from "src/providers/theme.provider";
import {
  Icon,
  Text,
  TouchableOpacity,
  TouchableText,
} from "./themed.components";
import fontUtils from "src/utils/font.utils";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import moment from "moment";
import colorsConstants, { colorPrimary } from "src/constants/colors.constants";
import { Modalize } from "react-native-modalize";

export type defaultInputProps = {
  inputHeight?: number;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  secureTextEntry?: boolean;
  hasError?: boolean;
  wrapperStyle?: StyleProp<ViewStyle>;
  labelPosision?: "top" | "bottom";
  errorType?: "error" | "info" | "success";
  staticHeight?: boolean;
  toolTip?: string;
  toolTipBackgroundColor?: ColorValue;
  activeToolTipColor?: string;
  inActiveToolTipColor?: string;
  borderRadius?: number;
  labelIcon?: JSX.Element;
} & InputProps;

export const Input = React.forwardRef<TextInput, defaultInputProps>(
  (
    {
      inputHeight = layoutConstants.inputHeight,
      containerStyle = {},
      labelStyle = {},
      secureTextEntry = false,
      errorMessage,
      errorType = "error",
      hasError,
      inputContainerStyle = {},
      inputStyle = {},
      label,
      wrapperStyle,
      labelPosision = "top",
      rightIcon,
      multiline,
      toolTip,
      staticHeight = true,
      onFocus = () => null,
      onBlur = () => null,
      // toolTipBackgroundColor = colorPrimary[100],
      // activeToolTipColor = colorPrimary[500],
      // inActiveToolTipColor = colorTextSubtle,
      placeholder,
      value = "",
      borderRadius = layoutConstants.inputRadius,
      labelIcon,
      ...props
    },
    ref,
  ) => {
    const [showEntry, setShowEntry] = useState(secureTextEntry);
    const { theme } = useAppTheme();
    const [focused, setFocused] = useState(false);
    const [borderColor, setBorderColor] = useState<undefined | string>(
      "rgba(0, 0, 0, 0.05)",
    );
    // colorOrange[100],

    const doOnFocus = (e: FocusEvent) => {
      // setBorderColor(colorPrimary);
      onFocus(e);
      setFocused(true);
    };

    const doOnBlur = (e: BlurEvent) => {
      // setBorderColor(colorOrange[100]);
      onBlur(e);
      setFocused(false);
    };

    return (
      <View style={[styles.inputWrapperStyle, wrapperStyle]}>
        <View style={[layoutConstants.styles.rowView, styles.labelViewStyle]}>
          {labelIcon}
          <Text ml={labelIcon ? fontUtils.w(10) : 0}>{label}</Text>
        </View>
        <RNEInput
          ref={ref}
          value={value}
          inputStyle={[
            {
              fontFamily: fontUtils.manrope_regular,
              paddingHorizontal: fontUtils.w(15),
              fontSize: fontUtils.h(14),
              height: inputHeight,
              paddingVertical: multiline ? fontUtils.h(10) : undefined,
            },
            inputStyle,
          ]}
          placeholder={placeholder}
          // placeholderTextColor={colorsConstants[theme].textDisabled}
          // cursorColor={colorsConstant.colorPrimary[100]}
          label={undefined}
          inputContainerStyle={[
            {
              height: staticHeight ? inputHeight : undefined,
              backgroundColor: "#FAFCFF",
              borderRadius,
              borderWidth: fontUtils.w(1),
              borderColor,
            },
            inputContainerStyle,
          ]}
          containerStyle={[
            {
              height: staticHeight ? inputHeight : undefined,
              paddingLeft: 0,
              paddingRight: 0,
              // marginBottom: label ? fontUtils.w(5) : fontUtils.w(20),
            },
            containerStyle,
          ]}
          multiline={multiline}
          rightIcon={
            secureTextEntry && !rightIcon ? (
              <Icon
                onPress={() => setShowEntry(!showEntry)}
                name={!showEntry ? `eye-off` : `eye`}
                type="ionicon"
                size={fontUtils.h(16)}
                // color={colorsConstants[theme].textSubtle}
                iconStyle={{
                  opacity: 0.5,
                }}
                containerStyle={
                  {
                    // marginRight: fontUtils.w(10),
                  }
                }
              />
            ) : (
              rightIcon
            )
          }
          // errorMessage={errorMessage}
          secureTextEntry={showEntry}
          // errorStyle={[
          //   defaultErrorMessageStyle,
          //   {
          //     color:
          //       errorType === "success"
          //         ? colorsConstant.success[900]
          //         : errorType === "info"
          //           ? colorsConstant.textLabel[theme]
          //           : colorsConstant.colorDanger,
          //     fontFamily: fontUtils.outfit_500,
          //     fontSize: fontUtils.h(12),
          //   },
          // ]}
          onFocus={doOnFocus}
          onBlur={doOnBlur}
          {...props}
        />
      </View>
    );
  },
);

export const SelectInput = ({
  items = [
    {
      label: "Item 1",
      value: "item 1",
    },
  ],
  value = "item 1",
  setValue,
  inputHeight = layoutConstants.inputHeight,
  containerStyle = {},
  listMode,
  placeholder = "Select",
  dropDownDirection = "AUTO",
  dropDownContainerStyle,
  modalContentContainerStyle,
  searchable = false,
  searchPlaceholder,
  onSelectItem = () => null,
  onChangeValue = () => null,
  itemKey = "value",
  renderListItem,
  labelProps,
  wrapperStyle,
  label = null,
  labelStyle,
  errorMessage,
  showErrorMessage = true,
  loading = false,
  errorMessageStyle = {},
  disabled = false,
  disabledItemLabelStyle = {},
  placeholderStyle = {},
  maxHeight,
  textStyle,
  searchTextInputProps,
  onChangeSearchText,
  disableLocalSearch,
  showCaret = true,
  onOpen,
  onClose,
  style,
  zIndex,
  schema,
  searchContainerStyle,
  ListEmptyComponent,
  isOpen = false,
  listChildLabelStyle,
  listItemLabelStyle,
  errorType = "error",
  multiple,
}: {
  value: any;
  items: {
    label: string;
    value: string | number;
  }[];
  schema?: any;
  setValue?: any;
  inputHeight?: number;
  containerStyle?: StyleProp<ViewStyle>;
  dropDownContainerStyle?: StyleProp<ViewStyle>;
  listMode?: "MODAL" | "FLATLIST" | "SCROLLVIEW" | undefined;
  placeholder?: string;
  searchable?: boolean;
  dropDownDirection?: "AUTO" | "BOTTOM" | "TOP" | "DEFAULT";
  searchPlaceholder?: string;
  onSelectItem?: Function;
  onChangeValue?: Function;
  itemKey?: string;
  renderListItem?: any;
  labelProps?: TextProps;
  wrapperStyle?: StyleProp<ViewStyle>;
  modalContentContainerStyle?: StyleProp<ViewStyle>;
  label?: string | JSX.Element | null;
  labelStyle?: StyleProp<TextStyle>;
  errorMessage?: string;
  showErrorMessage?: boolean;
  loading?: boolean;
  errorMessageStyle?: StyleProp<TextStyle>;
  disabledItemLabelStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  placeholderStyle?: StyleProp<TextStyle>;
  maxHeight?: number;
  textStyle?: StyleProp<TextStyle>;
  searchTextInputProps?: TextInputProps;
  onChangeSearchText?: any;
  disableLocalSearch?: boolean;
  showCaret?: boolean;
  onOpen?: any;
  onClose?: any;
  style?: StyleProp<ViewStyle>;
  zIndex?: number;
  searchContainerStyle?: StyleProp<ViewStyle>;
  ListEmptyComponent?: Function;
  isOpen?: boolean;
  listChildLabelStyle?: StyleProp<TextStyle>;
  listItemLabelStyle?: StyleProp<TextStyle>;
  errorType?: "error" | "info" | "success";
  multiple?: boolean;
}) => {
  const { theme } = useAppTheme();

  const _isOpen = useMemo(() => {
    return isOpen;
  }, [isOpen]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(_isOpen);
  }, [_isOpen]);

  return (
    <View
      style={[
        {
          marginBottom: errorMessage ? fontUtils.h(10) : undefined,
        },
        wrapperStyle,
      ]}
    >
      <DropDownPicker
        open={open}
        value={value}
        searchable={searchable}
        onOpen={onOpen}
        onClose={onClose}
        activityIndicatorColor={colorPrimary}
        searchPlaceholder={searchPlaceholder}
        items={items}
        setOpen={setOpen}
        schema={schema}
        multiple={multiple}
        searchTextInputProps={searchTextInputProps}
        onChangeSearchText={onChangeSearchText}
        disableLocalSearch={disableLocalSearch}
        setValue={setValue}
        onSelectItem={(v: any) => onSelectItem(v)}
        onChangeValue={(v: any) => onChangeValue(v)}
        placeholder={placeholder}
        listMode={listMode}
        itemKey={itemKey}
        renderListItem={renderListItem}
        dropDownDirection={dropDownDirection}
        theme={theme === "dark" ? `DARK` : `LIGHT`}
        zIndex={zIndex}
        placeholderStyle={[
          {
            // fontFamily: fontUtils.sora_regular,
            // fontSize: fontUtils.h(12),
            // color: colorsConstant.textIconSecondary[theme],
            // opacity: 0.5,
          },
          placeholderStyle,
        ]}
        listChildLabelStyle={listChildLabelStyle}
        listItemLabelStyle={listItemLabelStyle}
        maxHeight={maxHeight}
        labelProps={labelProps}
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
        searchContainerStyle={searchContainerStyle}
        containerStyle={[
          {
            minHeight: inputHeight,
            // marginBottom: fontUtils.h(20),
          },
          containerStyle,
        ]}
        textStyle={[
          {
            fontFamily: fontUtils.manrope_regular,
            paddingHorizontal: fontUtils.w(15),
            fontSize: fontUtils.h(14),
          },
          textStyle,
        ]}
        selectedItemLabelStyle={{}}
        labelStyle={{}}
        style={[
          {
            backgroundColor: "#FAFCFF",
            borderColor: "rgba(0, 0, 0, 0.05)",
            // backgroundColor: colorsConstants[theme].inputBg,
            // borderColor:
            //   usageMode === "user" ? colorOrange[100] : colorLavendar[100],
            borderWidth: fontUtils.w(1),
            minHeight: inputHeight,
          },
          style,
        ]}
        modalContentContainerStyle={[
          {
            backgroundColor: "#FAFCFF",
          },
          modalContentContainerStyle,
        ]}
        dropDownContainerStyle={[
          {
            backgroundColor: "#FAFCFF",
            borderColor: "rgba(0, 0, 0, 0.05)",
            borderWidth: 1,
            borderRadius: fontUtils.r(8),
          },
          dropDownContainerStyle,
        ]}
        disabledItemLabelStyle={[
          {
            opacity: 0.5,
          },
          disabledItemLabelStyle,
        ]}
        CloseIconComponent={({ style }) =>
          loading ? (
            <ActivityIndicator color={colorPrimary} size={fontUtils.w(20)} />
          ) : value &&
            value !== "" &&
            typeof value !== "undefined" &&
            value?.length > 0 ? (
            <TouchableText
              fontFamily={fontUtils.manrope_medium}
              onPress={() => setOpen(false)}
            >
              Done
            </TouchableText>
          ) : (
            <Icon
              name="close"
              type="ionicon"
              size={fontUtils.h(30)}
              color={colorsConstants[theme].text}
              onPress={() => setOpen(false)}
            />
          )
        }
        TickIconComponent={({ style }) => (
          <Icon
            name="checkmark"
            type="ionicon"
            // size={fontUtils.w(13)}
          />
        )}
        ArrowDownIconComponent={({ style }) =>
          !showCaret ? (
            <></>
          ) : !loading ? (
            <Icon
              name="chevron-down"
              type="ionicon"
              // color={colorsConstant.textIconSecondary[theme]}
              style={{
                opacity: 0.5,
              }}
              size={fontUtils.w(15)}
            />
          ) : (
            <ActivityIndicator color={colorPrimary} size={fontUtils.w(20)} />
          )
        }
        ArrowUpIconComponent={({ style }) =>
          !showCaret ? (
            <></>
          ) : !loading ? (
            <Icon
              name="chevron-up"
              type="ionicon"
              // color={colorsConstant.textIconSecondary[theme]}
              style={{
                opacity: 0.5,
              }}
              size={fontUtils.w(15)}
            />
          ) : (
            <ActivityIndicator color={colorPrimary} size={fontUtils.w(20)} />
          )
        }
        disabled={disabled}
        ListEmptyComponent={
          ListEmptyComponent ? (props) => ListEmptyComponent(props) : undefined
        }
      />
      {errorMessage && showErrorMessage && (
        <Text
          style={[
            // defaultErrorMessageStyle,
            {
              // color:
              //   errorType === "success"
              //     ? colorsConstant.colorPrimary
              //     : // : errorType === "info"
              //       //   ? colorsConstant[theme].border
              //       colorDanger,
            },
            errorMessageStyle,
          ]}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

export const DateTimeInput = ({
  date = new Date(),
  wrapperStyle,
  containerStyle,
  label,
  labelStyle,
  inputLabel = `Select Date`,
  format = "MMM DD, YYYY",
  displayIos = `spinner`,
  displayAndroid,
  maximumDate,
  minimumDate,
  mode,
  onChange = () => null,
  showIcon = true,
  valueTextStyle,
  disabled,
}: {
  date?: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  wrapperStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  label?: string;
  disabled?: boolean;
  inputLabel?: string;
  labelStyle?: StyleProp<TextStyle>;
  valueTextStyle?: StyleProp<TextStyle>;
  format?: string;
  displayIos?:
    | "spinner"
    | "inline"
    | "default"
    | "compact"
    | "clock"
    | "calendar";
  displayAndroid?:
    | "spinner"
    | "inline"
    | "default"
    | "compact"
    | "clock"
    | "calendar";
  mode?: "countdown" | "date" | "datetime" | "time";
  onChange?: Function;
  showIcon?: boolean;
}) => {
  const { theme } = useAppTheme();

  const [value, setValue] = useState<Date>(
    date === null ? moment().toDate() : date,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  // On Android, datetime mode is split into date-then-time steps
  const [androidPickerStep, setAndroidPickerStep] = useState<"date" | "time">("date");
  const [pendingDate, setPendingDate] = useState<Date | null>(null);
  const dateModalRef = useRef<Modalize>(null);

  const onChangeVal = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (event.type === "dismissed") {
        setPendingDate(null);
        setAndroidPickerStep("date");
        return;
      }
      if (mode === "datetime") {
        if (androidPickerStep === "date") {
          // Store the chosen date, now show time picker
          const chosen = selectedDate || value;
          setPendingDate(chosen);
          setAndroidPickerStep("time");
          setShowDatePicker(true);
          return;
        } else {
          // Merge time into the pending date
          const base = pendingDate || value;
          const merged = new Date(base);
          const t = selectedDate || value;
          merged.setHours(t.getHours(), t.getMinutes(), t.getSeconds());
          setPendingDate(null);
          setAndroidPickerStep("date");
          setValue(merged);
          onChange(merged);
          return;
        }
      }
    }
    setValue(selectedDate || new Date());
    onChange(selectedDate);
  };

  // Determine which mode to actually pass to the native picker on Android
  const activeAndroidMode: "date" | "time" | "countdown" =
    Platform.OS === "android" && mode === "datetime"
      ? androidPickerStep
      : (mode as any) || "date";

  const renderPicker = () => {
    return (
      //@ts-ignore
      <DateTimePicker
        testID="dateTimePicker"
        value={androidPickerStep === "time" && pendingDate ? pendingDate : value}
        mode={Platform.OS === "android" ? activeAndroidMode : (mode || "date")}
        display={Platform.OS === "ios" ? displayIos : displayAndroid}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
        onChange={onChangeVal}
        accentColor={colorPrimary}
        style={{
          backgroundColor: colorsConstants[theme].background,
        }}
        themeVariant={theme}
      />
    );
  };

  return (
    <View
      style={[
        {
          marginBottom: fontUtils.h(10),
        },
        wrapperStyle,
      ]}
    >
      {label ? (
        <Text
          style={[
            {
              marginBottom: fontUtils.h(5),
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      ) : null}
      <TouchableOpacity
        disabled={disabled}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#FAFCFF",
            paddingHorizontal: fontUtils.w(15),
            height: layoutConstants.inputHeight,
            borderRadius: fontUtils.h(8),
          },
          containerStyle,
        ]}
        onPress={() => {
          if (Platform.OS === "ios") {
            dateModalRef?.current?.open();
          } else {
            setShowDatePicker(true);
          }
        }}
      >
        <Text
          style={[
            {
              flex: showIcon ? 1 : undefined,
              textTransform: date === null ? "none" : "uppercase",
            },
            valueTextStyle,
          ]}
        >
          {date === null ? inputLabel : `${moment(value).format(format)}`}
        </Text>
        {showIcon && (
          <Icon
            name={
              mode === "datetime" || mode === "time"
                ? "time-outline"
                : "calendar-outline"
            }
            type="ionicon"
            size={fontUtils.h(15)}
            // color={colorsConstant[theme].text}
            style={{
              opacity: 0.5,
            }}
          />
        )}
      </TouchableOpacity>
      {showDatePicker && renderPicker()}
      <Modalize
        ref={dateModalRef}
        withReactModal
        adjustToContentHeight
        handlePosition="inside"
      >
        <View
          style={{
            marginTop: fontUtils.h(20),
            marginBottom: fontUtils.h(30),
          }}
        >
          {renderPicker()}
        </View>
      </Modalize>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapperStyle: {
    marginBottom: fontUtils.h(15),
  },
  labelViewStyle: {
    marginBottom: fontUtils.h(10),
  },
});
