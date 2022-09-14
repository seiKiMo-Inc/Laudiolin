export default {};

// import React from "react";
//
// import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
//
// import Button from "./Button";
// import VolumeControl from "@components/music/VolumeControl";
// import ProgressBarComponent from "@components/music/ProgressBar";
//
// import { player, Track, setVolume } from "@backend/audio";
//
// interface IProps {
//     style?: React.CSSProperties
// }
// interface IState {
//     playing: boolean;
//     muted: boolean;
//     volume: number;
//     progress: number;
//     lightShow: boolean;
//     showControls: boolean;
// }
//
// const toggleTrack = (track: Track | undefined, state: IState, setState: React.Dispatch<React.SetStateAction<IState>>) => {
//     track?.isPlaying() ? track?.pause() : track?.resume();
//     setState({ ...state, playing: !state.playing });
// };
//
// function changeVolume(
//     track: Track | undefined,
//     state: IState,
//     value: number,
//     setState: React.Dispatch<React.SetStateAction<IState>>
// ) {
//     // Set the player volume.
//     setVolume(value / 100);
//     // Call the state callback.
//     setState({ ...state, volume: value });
// }
//
// const toggleMute = (track: Track | undefined, state: IState, setState: React.Dispatch<React.SetStateAction<IState>>) => {
//     state.muted ? track?.unmute() : track?.mute();
//     setState({ ...state, muted: !state.muted });
// };
//
// const setProgress = (track: Track | undefined, value: number) => {
//     track?.seek(value);
// };
//
// class ControlsBad extends React.Component<IProps, IState> {
//     showControls: boolean = true;
//     originalColors: string[] = [];
//
//     constructor(props: IProps) {
//         super(props);
//
//         this.state = {
//             playing: false,
//             muted: false,
//             volume: 100,
//             progress: 0,
//             lightShow: false,
//             showControls: true
//         };
//     }
//
//     toggleControls = () => {
//         this.setState({ showControls: !this.state.showControls });
//     };
//
//     async componentDidMount() {
//         setInterval(() => {
//             this.setState({ progress: player.getCurrentTrack()?.seek() || 0 });
//         }, 100);
//     }
//
//     render() {
//         return (
//             <>
//                 <div
//                     style={{
//                         display: this.state.showControls ? "unset" : "none"
//                     }}
//                     className={"controls"}
//                 >
//                     <span
//                         style={{
//                             display: "table",
//                             margin: "0 auto",
//                             padding: "10px"
//                         }}
//                     >
//                         <Button
//                             className={"control"}
//                             tooltip={"play/pause"}
//                             onClick={() => toggleTrack(player.getCurrentTrack(), this.state, this.setState.bind(this))}
//                             icon={this.state.playing ? faPause : faPlay}
//                         />
//
//                         <VolumeControl
//                             volume={this.state.volume}
//                             muted={this.state.muted}
//                             setVolume={(value) =>
//                                 changeVolume(player.getCurrentTrack(), this.state, value, this.setState.bind(this))
//                             }
//                             toggleMute={() => toggleMute(player.getCurrentTrack(), this.state, this.setState.bind(this))}
//                         />
//                     </span>
//
//                     <ProgressBarComponent
//                         progress={this.state.progress}
//                         duration={player.getCurrentTrack()?.duration() || 0}
//                         setProgress={(value) => setProgress(player.getCurrentTrack(), value)}
//                     />
//                 </div>
//             </>
//         );
//     }
// }
//
// export default ControlsBad;