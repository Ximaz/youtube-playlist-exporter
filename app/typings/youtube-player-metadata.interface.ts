export interface YoutubePlayerMetadata {
  responseContext: ResponseContext;
  playabilityStatus: PlayabilityStatus;
  streamingData: StreamingData;
  playbackTracking: PlaybackTracking;
  captions: Captions;
  videoDetails: VideoDetails;
  playerConfig: PlayerConfig;
  storyboards: Storyboards;
  microformat: Microformat;
  cards: Cards;
  trackingParams: string;
  attestation: Attestation;
  messages: Message2[];
  adPlacements: AdPlacement[];
  auxiliaryUi: AuxiliaryUi;
  adBreakHeartbeatParams: string;
  frameworkUpdates: FrameworkUpdates;
}

interface ResponseContext {
  serviceTrackingParams: ServiceTrackingParam[];
  maxAgeSeconds: number;
  mainAppWebResponseContext: MainAppWebResponseContext;
  webResponseContextExtensionData: WebResponseContextExtensionData;
}

interface ServiceTrackingParam {
  service: string;
  params: Param[];
}

interface Param {
  key: string;
  value: string;
}

interface MainAppWebResponseContext {
  datasyncId: string;
  loggedOut: boolean;
  trackingParam: string;
}

interface WebResponseContextExtensionData {
  hasDecorated: boolean;
}

interface PlayabilityStatus {
  status: string;
  playableInEmbed: boolean;
  miniplayer: Miniplayer;
  contextParams: string;
  paygatedQualitiesMetadata: PaygatedQualitiesMetadata;
}

interface Miniplayer {
  miniplayerRenderer: MiniplayerRenderer;
}

interface MiniplayerRenderer {
  playbackMode: string;
}

interface PaygatedQualitiesMetadata {
  qualityDetails: QualityDetail[];
  restrictedAdaptiveFormats: RestrictedAdaptiveFormat[];
}

interface QualityDetail {
  key: string;
  value: Value;
}

interface Value {
  paygatedIndicatorText: string;
  endpoint: Endpoint;
  trackingParams: string;
}

interface Endpoint {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata;
  showDialogCommand: ShowDialogCommand;
}

interface CommandMetadata {
  interactionLoggingCommandMetadata: InteractionLoggingCommandMetadata;
}

interface InteractionLoggingCommandMetadata {
  screenVisualElement: ScreenVisualElement;
}

interface ScreenVisualElement {
  uiType: number;
}

interface ShowDialogCommand {
  panelLoadingStrategy: PanelLoadingStrategy;
}

interface PanelLoadingStrategy {
  requestTemplate: RequestTemplate;
  screenVe: number;
}

interface RequestTemplate {
  panelId: string;
  params: string;
}

interface RestrictedAdaptiveFormat {
  itag: number;
  mimeType: string;
  bitrate: number;
  width: number;
  height: number;
  initRange: InitRange;
  indexRange: IndexRange;
  lastModified: string;
  contentLength: string;
  quality: string;
  fps: number;
  qualityLabel: string;
  projectionType: string;
  averageBitrate: number;
  colorInfo: ColorInfo;
  approxDurationMs: string;
}

interface InitRange {
  start: string;
  end: string;
}

interface IndexRange {
  start: string;
  end: string;
}

interface ColorInfo {
  primaries: string;
  transferCharacteristics: string;
  matrixCoefficients: string;
}

interface StreamingData {
  expiresInSeconds: string;
  formats: Format[];
  adaptiveFormats: AdaptiveFormat[];
  serverAbrStreamingUrl: string;
}

export interface Format {
  itag: number;
  mimeType: string;
  bitrate: number;
  width: number;
  height: number;
  lastModified: string;
  quality: string;
  xtags: string;
  fps: number;
  qualityLabel: string;
  projectionType: string;
  audioQuality: string;
  approxDurationMs: string;
  audioSampleRate: string;
  audioChannels: number;
  signatureCipher: string;
}

export interface AdaptiveFormat {
  itag: number;
  mimeType: string;
  bitrate: number;
  width?: number;
  height?: number;
  initRange: InitRange2;
  indexRange: IndexRange2;
  lastModified: string;
  contentLength: string;
  quality: string;
  url?: string;
  fps?: number;
  qualityLabel?: string;
  projectionType: string;
  averageBitrate: number;
  approxDurationMs: string;
  signatureCipher: string;
  colorInfo?: ColorInfo2;
  highReplication?: boolean;
  audioQuality?: string;
  audioSampleRate?: string;
  audioChannels?: number;
  loudnessDb?: number;
}

interface InitRange2 {
  start: string;
  end: string;
}

interface IndexRange2 {
  start: string;
  end: string;
}

interface ColorInfo2 {
  primaries: string;
  transferCharacteristics: string;
  matrixCoefficients: string;
}

interface PlaybackTracking {
  videostatsPlaybackUrl: VideostatsPlaybackUrl;
  videostatsDelayplayUrl: VideostatsDelayplayUrl;
  videostatsWatchtimeUrl: VideostatsWatchtimeUrl;
  ptrackingUrl: PtrackingUrl;
  qoeUrl: QoeUrl;
  atrUrl: AtrUrl;
  videostatsScheduledFlushWalltimeSeconds: number[];
  videostatsDefaultFlushIntervalSeconds: number;
}

interface VideostatsPlaybackUrl {
  baseUrl: string;
}

interface VideostatsDelayplayUrl {
  baseUrl: string;
}

interface VideostatsWatchtimeUrl {
  baseUrl: string;
}

interface PtrackingUrl {
  baseUrl: string;
}

interface QoeUrl {
  baseUrl: string;
}

interface AtrUrl {
  baseUrl: string;
  elapsedMediaTimeSeconds: number;
}

interface Captions {
  playerCaptionsTracklistRenderer: PlayerCaptionsTracklistRenderer;
}

interface PlayerCaptionsTracklistRenderer {
  captionTracks: CaptionTrack[];
  audioTracks: AudioTrack[];
  translationLanguages: TranslationLanguage[];
  defaultAudioTrackIndex: number;
}

interface CaptionTrack {
  baseUrl: string;
  name: Name;
  vssId: string;
  languageCode: string;
  kind: string;
  isTranslatable: boolean;
  trackName: string;
}

interface Name {
  simpleText: string;
}

interface AudioTrack {
  captionTrackIndices: number[];
}

interface TranslationLanguage {
  languageCode: string;
  languageName: LanguageName;
}

interface LanguageName {
  simpleText: string;
}

interface VideoDetails {
  videoId: string;
  title: string;
  lengthSeconds: string;
  channelId: string;
  isOwnerViewing: boolean;
  shortDescription: string;
  isCrawlable: boolean;
  thumbnail: Thumbnail;
  allowRatings: boolean;
  viewCount: string;
  author: string;
  isPrivate: boolean;
  isUnpluggedCorpus: boolean;
  isLiveContent: boolean;
}

interface Thumbnail {
  thumbnails: Thumbnail2[];
}

interface Thumbnail2 {
  url: string;
  width: number;
  height: number;
}

interface PlayerConfig {
  audioConfig: AudioConfig;
  streamSelectionConfig: StreamSelectionConfig;
  mediaCommonConfig: MediaCommonConfig;
  webPlayerConfig: WebPlayerConfig;
}

interface AudioConfig {
  loudnessDb: number;
  perceptualLoudnessDb: number;
  enablePerFormatLoudness: boolean;
}

interface StreamSelectionConfig {
  maxBitrate: string;
}

interface MediaCommonConfig {
  dynamicReadaheadConfig: DynamicReadaheadConfig;
  mediaUstreamerRequestConfig: MediaUstreamerRequestConfig;
  useServerDrivenAbr: boolean;
  serverPlaybackStartConfig: ServerPlaybackStartConfig;
}

interface DynamicReadaheadConfig {
  maxReadAheadMediaTimeMs: number;
  minReadAheadMediaTimeMs: number;
  readAheadGrowthRateMs: number;
}

interface MediaUstreamerRequestConfig {
  videoPlaybackUstreamerConfig: string;
}

interface ServerPlaybackStartConfig {
  enable: boolean;
  playbackStartPolicy: PlaybackStartPolicy;
}

interface PlaybackStartPolicy {
  startMinReadaheadPolicy: StartMinReadaheadPolicy[];
}

interface StartMinReadaheadPolicy {
  minReadaheadMs: number;
}

interface WebPlayerConfig {
  useCobaltTvosDash: boolean;
  webPlayerActionsPorting: WebPlayerActionsPorting;
}

interface WebPlayerActionsPorting {
  getSharePanelCommand: GetSharePanelCommand;
  subscribeCommand: SubscribeCommand;
  unsubscribeCommand: UnsubscribeCommand;
  addToWatchLaterCommand: AddToWatchLaterCommand;
  removeFromWatchLaterCommand: RemoveFromWatchLaterCommand;
}

interface GetSharePanelCommand {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata2;
  webPlayerShareEntityServiceEndpoint: WebPlayerShareEntityServiceEndpoint;
}

interface CommandMetadata2 {
  webCommandMetadata: WebCommandMetadata;
}

interface WebCommandMetadata {
  sendPost: boolean;
  apiUrl: string;
}

interface WebPlayerShareEntityServiceEndpoint {
  serializedShareEntity: string;
}

interface SubscribeCommand {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata3;
  subscribeEndpoint: SubscribeEndpoint;
}

interface CommandMetadata3 {
  webCommandMetadata: WebCommandMetadata2;
}

interface WebCommandMetadata2 {
  sendPost: boolean;
  apiUrl: string;
}

interface SubscribeEndpoint {
  channelIds: string[];
  params: string;
}

interface UnsubscribeCommand {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata4;
  unsubscribeEndpoint: UnsubscribeEndpoint;
}

interface CommandMetadata4 {
  webCommandMetadata: WebCommandMetadata3;
}

interface WebCommandMetadata3 {
  sendPost: boolean;
  apiUrl: string;
}

interface UnsubscribeEndpoint {
  channelIds: string[];
  params: string;
}

interface AddToWatchLaterCommand {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata5;
  playlistEditEndpoint: PlaylistEditEndpoint;
}

interface CommandMetadata5 {
  webCommandMetadata: WebCommandMetadata4;
}

interface WebCommandMetadata4 {
  sendPost: boolean;
  apiUrl: string;
}

interface PlaylistEditEndpoint {
  playlistId: string;
  actions: Action[];
}

interface Action {
  addedVideoId: string;
  action: string;
}

interface RemoveFromWatchLaterCommand {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata6;
  playlistEditEndpoint: PlaylistEditEndpoint2;
}

interface CommandMetadata6 {
  webCommandMetadata: WebCommandMetadata5;
}

interface WebCommandMetadata5 {
  sendPost: boolean;
  apiUrl: string;
}

interface PlaylistEditEndpoint2 {
  playlistId: string;
  actions: Action2[];
}

interface Action2 {
  action: string;
  removedVideoId: string;
}

interface Storyboards {
  playerStoryboardSpecRenderer: PlayerStoryboardSpecRenderer;
}

interface PlayerStoryboardSpecRenderer {
  spec: string;
  recommendedLevel: number;
  highResolutionRecommendedLevel: number;
}

interface Microformat {
  playerMicroformatRenderer: PlayerMicroformatRenderer;
}

interface PlayerMicroformatRenderer {
  thumbnail: Thumbnail3;
  embed: Embed;
  title: Title;
  description: Description;
  lengthSeconds: string;
  ownerProfileUrl: string;
  externalChannelId: string;
  isFamilySafe: boolean;
  availableCountries: string[];
  isUnlisted: boolean;
  hasYpcMetadata: boolean;
  viewCount: string;
  category: string;
  publishDate: string;
  ownerChannelName: string;
  uploadDate: string;
  isShortsEligible: boolean;
}

interface Thumbnail3 {
  thumbnails: Thumbnail4[];
}

interface Thumbnail4 {
  url: string;
  width: number;
  height: number;
}

interface Embed {
  iframeUrl: string;
  width: number;
  height: number;
}

interface Title {
  simpleText: string;
}

interface Description {
  simpleText: string;
}

interface Cards {
  cardCollectionRenderer: CardCollectionRenderer;
}

interface CardCollectionRenderer {
  cards: Card[];
  headerText: HeaderText;
  icon: Icon;
  closeButton: CloseButton;
  trackingParams: string;
  allowTeaserDismiss: boolean;
  logIconVisibilityUpdates: boolean;
}

interface Card {
  cardRenderer: CardRenderer;
}

interface CardRenderer {
  teaser: Teaser;
  cueRanges: CueRange[];
  trackingParams: string;
}

interface Teaser {
  simpleCardTeaserRenderer: SimpleCardTeaserRenderer;
}

interface SimpleCardTeaserRenderer {
  message: Message;
  trackingParams: string;
  prominent: boolean;
  logVisibilityUpdates: boolean;
  onTapCommand: OnTapCommand;
}

interface Message {
  simpleText: string;
}

interface OnTapCommand {
  clickTrackingParams: string;
  changeEngagementPanelVisibilityAction: ChangeEngagementPanelVisibilityAction;
}

interface ChangeEngagementPanelVisibilityAction {
  targetId: string;
  visibility: string;
}

interface CueRange {
  startCardActiveMs: string;
  endCardActiveMs: string;
  teaserDurationMs: string;
  iconAfterTeaserMs: string;
}

interface HeaderText {
  simpleText: string;
}

interface Icon {
  infoCardIconRenderer: InfoCardIconRenderer;
}

interface InfoCardIconRenderer {
  trackingParams: string;
}

interface CloseButton {
  infoCardIconRenderer: InfoCardIconRenderer2;
}

interface InfoCardIconRenderer2 {
  trackingParams: string;
}

interface Attestation {
  playerAttestationRenderer: PlayerAttestationRenderer;
}

interface PlayerAttestationRenderer {
  challenge: string;
  botguardData: BotguardData;
}

interface BotguardData {
  program: string;
  interpreterSafeUrl: InterpreterSafeUrl;
  serverEnvironment: number;
}

interface InterpreterSafeUrl {
  privateDoNotAccessOrElseTrustedResourceUrlWrappedValue: string;
}

interface Message2 {
  mealbarPromoRenderer: MealbarPromoRenderer;
}

interface MealbarPromoRenderer {
  messageTexts: MessageText[];
  actionButton: ActionButton;
  dismissButton: DismissButton;
  triggerCondition: string;
  style: string;
  trackingParams: string;
  impressionEndpoints: ImpressionEndpoint[];
  isVisible: boolean;
  messageTitle: MessageTitle;
  logo: Logo;
  logoDark: LogoDark;
}

interface MessageText {
  runs: Run[];
}

interface Run {
  text: string;
}

interface ActionButton {
  buttonRenderer: ButtonRenderer;
}

interface ButtonRenderer {
  style: string;
  size: string;
  text: Text;
  trackingParams: string;
  command: Command;
}

interface Text {
  runs: Run2[];
}

interface Run2 {
  text: string;
}

interface Command {
  clickTrackingParams: string;
  commandExecutorCommand: CommandExecutorCommand;
}

interface CommandExecutorCommand {
  commands: Command2[];
}

interface Command2 {
  clickTrackingParams?: string;
  commandMetadata: CommandMetadata7;
  browseEndpoint?: BrowseEndpoint;
  feedbackEndpoint?: FeedbackEndpoint;
}

interface CommandMetadata7 {
  webCommandMetadata: WebCommandMetadata6;
}

interface WebCommandMetadata6 {
  url?: string;
  webPageType?: string;
  rootVe?: number;
  apiUrl: string;
  sendPost?: boolean;
}

interface BrowseEndpoint {
  browseId: string;
  params: string;
}

interface FeedbackEndpoint {
  feedbackToken: string;
  uiActions: UiActions;
}

interface UiActions {
  hideEnclosingContainer: boolean;
}

interface DismissButton {
  buttonRenderer: ButtonRenderer2;
}

interface ButtonRenderer2 {
  style: string;
  size: string;
  text: Text2;
  trackingParams: string;
  command: Command3;
}

interface Text2 {
  runs: Run3[];
}

interface Run3 {
  text: string;
}

interface Command3 {
  clickTrackingParams: string;
  commandExecutorCommand: CommandExecutorCommand2;
}

interface CommandExecutorCommand2 {
  commands: Command4[];
}

interface Command4 {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata8;
  feedbackEndpoint: FeedbackEndpoint2;
}

interface CommandMetadata8 {
  webCommandMetadata: WebCommandMetadata7;
}

interface WebCommandMetadata7 {
  sendPost: boolean;
  apiUrl: string;
}

interface FeedbackEndpoint2 {
  feedbackToken: string;
  uiActions: UiActions2;
}

interface UiActions2 {
  hideEnclosingContainer: boolean;
}

interface ImpressionEndpoint {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata9;
  feedbackEndpoint: FeedbackEndpoint3;
}

interface CommandMetadata9 {
  webCommandMetadata: WebCommandMetadata8;
}

interface WebCommandMetadata8 {
  sendPost: boolean;
  apiUrl: string;
}

interface FeedbackEndpoint3 {
  feedbackToken: string;
  uiActions: UiActions3;
}

interface UiActions3 {
  hideEnclosingContainer: boolean;
}

interface MessageTitle {
  runs: Run4[];
}

interface Run4 {
  text: string;
}

interface Logo {
  thumbnails: Thumbnail5[];
}

interface Thumbnail5 {
  url: string;
  width: number;
  height: number;
}

interface LogoDark {
  thumbnails: Thumbnail6[];
}

interface Thumbnail6 {
  url: string;
  width: number;
  height: number;
}

interface AdPlacement {
  adPlacementRenderer: AdPlacementRenderer;
}

interface AdPlacementRenderer {
  config: Config;
  renderer: Renderer;
  adSlotLoggingData: AdSlotLoggingData;
}

interface Config {
  adPlacementConfig: AdPlacementConfig;
}

interface AdPlacementConfig {
  kind: string;
  adTimeOffset: AdTimeOffset;
  hideCueRangeMarker: boolean;
}

interface AdTimeOffset {
  offsetStartMilliseconds: string;
  offsetEndMilliseconds: string;
}

interface Renderer {
  clientForecastingAdRenderer: ClientForecastingAdRenderer;
}

interface ClientForecastingAdRenderer {}

interface AdSlotLoggingData {
  serializedSlotAdServingDataEntry: string;
}

interface AuxiliaryUi {
  messageRenderers: MessageRenderers;
}

interface MessageRenderers {
  bkaEnforcementMessageViewModel: BkaEnforcementMessageViewModel;
}

interface BkaEnforcementMessageViewModel {
  title: Title2;
  primaryButton: PrimaryButton;
  secondaryButton: SecondaryButton;
  logo: Logo2;
  feedbackMessage: FeedbackMessage;
  trackingParams: string;
  bulletList: BulletList;
  logoDark: LogoDark2;
  impressionEndpoints: ImpressionEndpoint2[];
  displayType: string;
  isVisible: boolean;
}

interface Title2 {
  content: string;
  styleRuns: StyleRun[];
}

interface StyleRun {
  startIndex: number;
  length: number;
}

interface PrimaryButton {
  title: string;
  onTap: OnTap;
  accessibilityText: string;
  style: string;
  trackingParams: string;
  type: string;
  buttonSize: string;
  state: string;
  iconTrailing: boolean;
}

interface OnTap {
  parallelCommand: ParallelCommand;
}

interface ParallelCommand {
  commands: Command5[];
}

interface Command5 {
  innertubeCommand: InnertubeCommand;
}

interface InnertubeCommand {
  clickTrackingParams: string;
  commandMetadata?: CommandMetadata10;
  feedbackEndpoint?: FeedbackEndpoint4;
  openAdAllowlistInstructionCommand?: OpenAdAllowlistInstructionCommand;
}

interface CommandMetadata10 {
  webCommandMetadata: WebCommandMetadata9;
}

interface WebCommandMetadata9 {
  sendPost: boolean;
  apiUrl: string;
}

interface FeedbackEndpoint4 {
  feedbackToken: string;
  uiActions: UiActions4;
}

interface UiActions4 {
  hideEnclosingContainer: boolean;
}

interface OpenAdAllowlistInstructionCommand {
  fundingChoiceInstructionPageUrl: FundingChoiceInstructionPageUrl;
}

interface FundingChoiceInstructionPageUrl {
  privateDoNotAccessOrElseTrustedResourceUrlWrappedValue: string;
}

interface SecondaryButton {
  title: string;
  onTap: OnTap2;
  accessibilityText: string;
  style: string;
  trackingParams: string;
  type: string;
  buttonSize: string;
  state: string;
  iconTrailing: boolean;
}

interface OnTap2 {
  parallelCommand: ParallelCommand2;
}

interface ParallelCommand2 {
  commands: Command6[];
}

interface Command6 {
  innertubeCommand: InnertubeCommand2;
}

interface InnertubeCommand2 {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata11;
  feedbackEndpoint?: FeedbackEndpoint5;
  browseEndpoint?: BrowseEndpoint2;
}

interface CommandMetadata11 {
  webCommandMetadata: WebCommandMetadata10;
}

interface WebCommandMetadata10 {
  sendPost?: boolean;
  apiUrl: string;
  url?: string;
  webPageType?: string;
  rootVe?: number;
}

interface FeedbackEndpoint5 {
  feedbackToken: string;
  uiActions: UiActions5;
}

interface UiActions5 {
  hideEnclosingContainer: boolean;
}

interface BrowseEndpoint2 {
  browseId: string;
}

interface Logo2 {
  sources: Source[];
}

interface Source {
  url: string;
  width: number;
  height: number;
}

interface FeedbackMessage {
  content: string;
  commandRuns: CommandRun[];
  styleRuns: StyleRun2[];
}

interface CommandRun {
  startIndex: number;
  length: number;
  onTap: OnTap3;
}

interface OnTap3 {
  innertubeCommand: InnertubeCommand3;
}

interface InnertubeCommand3 {
  clickTrackingParams: string;
  sendFeedbackAction: SendFeedbackAction;
}

interface SendFeedbackAction {
  bucket: string;
  productId: string;
  enableAnonymousFeedback: boolean;
}

interface StyleRun2 {
  startIndex: number;
  length: number;
  fontColor?: number;
}

interface BulletList {
  bulletListItems: BulletListItem[];
}

interface BulletListItem {
  title: Title3;
}

interface Title3 {
  content: string;
  styleRuns: StyleRun3[];
}

interface StyleRun3 {
  startIndex: number;
  length: number;
}

interface LogoDark2 {
  sources: Source2[];
}

interface Source2 {
  url: string;
  width: number;
  height: number;
}

interface ImpressionEndpoint2 {
  innertubeCommand: InnertubeCommand4;
}

interface InnertubeCommand4 {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata12;
  feedbackEndpoint: FeedbackEndpoint6;
}

interface CommandMetadata12 {
  webCommandMetadata: WebCommandMetadata11;
}

interface WebCommandMetadata11 {
  sendPost: boolean;
  apiUrl: string;
}

interface FeedbackEndpoint6 {
  feedbackToken: string;
  uiActions: UiActions6;
}

interface UiActions6 {
  hideEnclosingContainer: boolean;
}

interface FrameworkUpdates {
  entityBatchUpdate: EntityBatchUpdate;
}

interface EntityBatchUpdate {
  mutations: Mutation[];
  timestamp: Timestamp;
}

interface Mutation {
  entityKey: string;
  type: string;
  payload: Payload;
}

interface Payload {
  offlineabilityEntity: OfflineabilityEntity;
}

interface OfflineabilityEntity {
  key: string;
  addToOfflineButtonState: string;
}

interface Timestamp {
  seconds: string;
  nanos: number;
}
